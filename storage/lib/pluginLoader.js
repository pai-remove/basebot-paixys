'use strict';
/**
 * Plugin Loader — Jembatan ESM (Shiroko) → CJS (BotGabungan)
 * Oleh: BotGabungan
 *
 * Cara kerja:
 *  1. Scan semua file .js di folder plugins/
 *  2. Load pakai dynamic import() karena plugin Shiroko pakai ESM (export default)
 *  3. Simpan ke global.plugins sebagai Map { nama: handlerObj }
 */

const fs   = require('fs');
const path = require('path');

const PLUGINS_DIR = path.join(__dirname, '../../plugins');
global.plugins = global.plugins || {};

/**
 * Normalisasi handler dari berbagai format plugin Shiroko:
 *  - export default handler (function)
 *  - export default { code, command, tags, ... }
 *  - export default { handler, command, tags, ... }
 */
function normalizePlugin(mod, filePath) {
    let plug = mod?.default ?? mod;

    // Format: fungsi langsung sebagai default export
    if (typeof plug === 'function') {
        // handler.command sudah ada di propertinya
        return plug;
    }

    // Format: object { code: async fn, command: [...] }
    if (plug && typeof plug.code === 'function') {
        const wrapper = async (m, ctx) => plug.code(m, ctx);
        Object.assign(wrapper, plug);
        wrapper.call = wrapper;
        return wrapper;
    }

    // Format: object { handler: async fn, command: [...] }
    if (plug && typeof plug.handler === 'function') {
        const wrapper = async (m, ctx) => plug.handler(m, ctx);
        Object.assign(wrapper, plug);
        return wrapper;
    }

    return null;
}

/**
 * Load satu file plugin
 */
async function loadPlugin(filePath) {
    try {
        // Pakai dynamic import untuk ESM
        const mod = await import(`file://${filePath}?t=${Date.now()}`);
        const plug = normalizePlugin(mod, filePath);

        if (!plug) return;

        const cmds = plug.command || plug.commands || [];
        const name = path.basename(filePath, '.js');

        global.plugins[name] = plug;

        const cmdList = Array.isArray(cmds) ? cmds : [cmds];
        // Daftarkan juga per-command supaya bisa di-lookup cepat
        for (const cmd of cmdList) {
            if (cmd) global.plugins[`cmd:${cmd}`] = plug;
        }
    } catch (e) {
        console.error(`[PluginLoader] Gagal load: ${path.basename(filePath)}\n→ ${e.message}`);
    }
}

/**
 * Scan semua sub-folder plugins/ dan load semuanya
 */
async function loadAllPlugins() {
    if (!fs.existsSync(PLUGINS_DIR)) {
        fs.mkdirSync(PLUGINS_DIR, { recursive: true });
        console.log('[PluginLoader] Folder plugins/ dibuat.');
        return;
    }

    const categories = fs.readdirSync(PLUGINS_DIR);
    let total = 0;

    for (const cat of categories) {
        const catPath = path.join(PLUGINS_DIR, cat);
        if (!fs.statSync(catPath).isDirectory()) continue;

        const files = fs.readdirSync(catPath).filter(f => f.endsWith('.js'));
        for (const file of files) {
            await loadPlugin(path.join(catPath, file));
            total++;
        }
    }

    console.log(`[PluginLoader] ✅ ${total} plugin dimuat dari ${PLUGINS_DIR}`);
}

/**
 * Watch file changes — hot reload plugin tanpa restart bot
 */
function watchPlugins() {
    if (!fs.existsSync(PLUGINS_DIR)) return;

    fs.watch(PLUGINS_DIR, { recursive: true }, async (event, filename) => {
        if (!filename || !filename.endsWith('.js')) return;
        const fullPath = path.join(PLUGINS_DIR, filename);
        if (!fs.existsSync(fullPath)) return;

        console.log(`[PluginLoader] 🔄 Hot-reload: ${filename}`);
        await loadPlugin(fullPath);
    });
}

module.exports = { loadAllPlugins, loadPlugin, watchPlugins };
