require('./settings/config')

/*
 BotGabungan — Core Handler + Plugin Loader
 Base: Pai SYX (github: Lycyzee)
 Plugin system ported from: ShirokoFork v3

 Modification is allowed.
 Credit removal is prohibited.
*/

const {
    downloadContentFromMessage,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    proto,
    Browsers,
} = global.baileysFuncs;

const fs      = require('fs')
const axios   = require('axios')
const fetch   = require('node-fetch')
const chalk   = require('chalk')
const speed   = require('performance-now')
const moment  = require('moment-timezone')
const os      = require('os')
const util    = require('util')
const { spawn, exec } = require('child_process')

// ── Plugin Loader ──────────────────────────────────────────
const { loadAllPlugins, watchPlugins } = require('./storage/lib/pluginLoader')

// Load semua plugin saat bot pertama kali jalan
if (!global._pluginsLoaded) {
    global._pluginsLoaded = true
    loadAllPlugins().then(() => {
        watchPlugins()
    })
}

module.exports = client = handler = async (client, m, chatUpdate, store) => {
    try {

        const { smsg, formatp, tanggal, formatDate, getTime, isUrl, sleep, clockString, runtime, fetchJson, getBuffer, jsonformat, format, parseMention, getRandom, getGroupAdmins } = require('./storage/lib/myfunc.js')
        const { toAudio, toPTT, toVideo, ffmpeg, addExifAvatar } = require('./storage/lib/converter')
        const { TelegraPh, UploadFileUgu, webp2mp4File, floNime } = require('./storage/lib/uploader')

        var body = (
            m.mtype === 'conversation'            ? m.message.conversation :
            m.mtype === 'imageMessage'            ? m.message.imageMessage.caption :
            m.mtype === 'videoMessage'            ? m.message.videoMessage.caption :
            m.mtype === 'extendedTextMessage'     ? m.message.extendedTextMessage.text :
            m.mtype === 'buttonsResponseMessage'  ? m.message.buttonsResponseMessage.selectedButtonId :
            m.mtype === 'listResponseMessage'     ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
            m.mtype === 'interactiveResponseMessage' ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id :
            m.mtype === 'templateButtonReplyMessage' ? m.message.templateButtonReplyMessage.selectedId :
            m.mtype === 'messageContextInfo' ?
                m.message.buttonsResponseMessage?.selectedButtonId ||
                m.message.listResponseMessage?.singleSelectReply.selectedRowId ||
                m.message.InteractiveResponseMessage?.NativeFlowResponseMessage ||
                m.text :
            ''
        )
        if (body == undefined) body = ''
        var budy = (typeof m.text == 'string' ? m.text : '')

        const prefixRegex = global.prefix || /^[.!#÷×/]/
        const prefixMatch = body.match(prefixRegex)
        const prefix      = prefixMatch ? prefixMatch[0] : null
        const isCmd       = prefix ? body.startsWith(prefix) : false
        const command     = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
        const args        = budy.trim().split(/ +/).slice(1)
        const q = text    = args.join(' ')

        const botNumber    = client.user.id.split(':')[0]
        const pushname     = m.pushName || 'No Name'
        const senderNumber = m.sender.split('@')[0]
        const itsMe        = m.sender == botNumber
        const isOwner      = [botNumber, ...global.owner]
            .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
            .includes(m.sender)

        if (!client.public) {
            if (!m.fromMe && !isOwner) return
        }

        const isGroup       = m.chat.endsWith('@g.us')
        const groupMetadata = isGroup ? await client.groupMetadata(m.chat).catch(e => {}) : ''
        const groupName     = isGroup ? groupMetadata.subject : ''
        const groupMembers  = isGroup ? groupMetadata.participants : ''
        const groupAdmins   = isGroup ? await getGroupAdmins(groupMembers) : ''
        const isBotAdmin    = isGroup ? groupAdmins.includes(botNumber + '@s.whatsapp.net') : false
        const isBotAdmins   = isGroup ? groupAdmins.includes(botNumber) : false
        const isAdmins      = isGroup ? groupAdmins.includes(m.sender) : false
        const groupOwner    = isGroup ? groupMetadata.owner : ''
        const isGroupOwner  = isGroup ? (groupOwner ? groupOwner : groupAdmins).includes(m.sender) : false

        const isMedia = (m.type === 'imageMessage' || m.type === 'videoMessage')
        const fatkuns = (m.quoted || m)
        const quoted  = (fatkuns.mtype == 'buttonsMessage') ? fatkuns[Object.keys(fatkuns)[1]]
            : (fatkuns.mtype == 'templateMessage') ? fatkuns.hydratedTemplate[Object.keys(fatkuns.hydratedTemplate)[1]]
            : (fatkuns.mtype == 'product') ? fatkuns[Object.keys(fatkuns)[0]]
            : m.quoted ? m.quoted : m
        const qmsg = (quoted.msg || quoted)
        const mime  = qmsg.mimetype || ''
        const ZrX   = fs.readFileSync('./storage/media/ZrX.jpeg')
        const image = fs.readFileSync('./storage/media/image.jpeg')

        const time = moment().tz('Asia/Jakarta').format('HH:mm:ss')
        let ucapanWaktu
        if      (time >= '19:00:00' && time < '23:59:00') ucapanWaktu = '夜 🌌'
        else if (time >= '15:00:00' && time < '19:00:00') ucapanWaktu = '午後 🌇'
        else if (time >= '11:00:00' && time < '15:00:00') ucapanWaktu = '正午 🏞️'
        else if (time >= '06:00:00' && time < '11:00:00') ucapanWaktu = '朝 🌁'
        else                                               ucapanWaktu = '夜明け 🌆'

        let d        = new Date()
        let gmt      = new Date(0).getTime() - new Date('1 Januari 2026').getTime()
        let weton    = ['Pahing','Pon','Wage','Kliwon','Legi'][Math.floor(((d * 1) + gmt) / 84600000) % 5]
        let week     = d.toLocaleDateString('id', { weekday: 'long' })
        let calendar = d.toLocaleDateString('id', { year:'numeric', month:'2-digit', day:'2-digit' }).split('/').reverse().join('-')

        const ctt = {
            key: { remoteJid: '0@s.whatsapp.net', participant: '0@s.whatsapp.net', fromMe: false },
            message: {
                contactMessage: {
                    displayName: pushname,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${pushname},;;;\nFN:${pushname}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
                }
            }
        }

        const reply = async (teks) => {
            await sleep(500)
            return client.sendMessage(m.chat, {
                contextInfo: {
                    mentionedJid: [m.sender],
                    externalAdReply: {
                        showAdAttribution: false,
                        renderLargerThumbnail: false,
                        title: 'BotGabungan',
                        body: 'Powered by WhatsApp Meta',
                        previewType: 'VIDEO',
                        thumbnail: ZrX,
                        sourceUrl: global.url,
                        mediaUrl: global.url,
                    }
                },
                text: teks
            }, { quoted: ctt })
        }

        // Tambahkan conn.reply untuk kompatibilitas plugin Shiroko
        client.reply = async (jid, text, quoted, opts = {}) => {
            return client.sendMessage(jid, { text, ...opts }, { quoted })
        }

        async function prM(params) {
            return await prepareWAMessageMedia(params, { upload: client.waUploadToServer })
        }

        if (isCmd) {
            const timeLog  = chalk.gray(new Date().toLocaleString('id-ID'))
            const cmdLog   = chalk.cyanBright(budy || m.mtype)
            const userLog  = chalk.green(pushname)
            const senderL  = chalk.yellow(m.sender)
            const chatLog  = chalk.blueBright(m.isGroup ? 'Group Chat' : 'Private Chat')
            const chatIdL  = chalk.gray(m.chat)

            console.log(`\n${chalk.bold.cyan('╭─〔 COMMAND RECEIVED 〕')}
${chalk.cyan('│')} 🕒 ${timeLog}
${chalk.cyan('│')} ⚡ ${cmdLog}
${chalk.cyan('│')}
${chalk.cyan('│')} 👤 ${userLog}
${chalk.cyan('│')} 🔗 ${senderL}
${chalk.cyan('│')}
${chalk.cyan('│')} 💬 ${chatLog}
${chalk.cyan('│')} 🆔 ${chatIdL}
${chalk.bold.cyan('╰────────────────────────')}\n`)
        }

        // ════════════════════════════════════════════════════
        //  PLUGIN DISPATCHER — jalankan plugin Shiroko
        // ════════════════════════════════════════════════════
        if (isCmd && command && global.plugins) {
            // Cari plugin berdasarkan command
            let plugin = global.plugins[`cmd:${command}`]

            // Kalau tidak ketemu di index cepat, scan semua plugin
            if (!plugin) {
                for (const name in global.plugins) {
                    if (name.startsWith('cmd:')) continue
                    const p = global.plugins[name]
                    if (!p) continue
                    const cmds = p.command || p.commands || []
                    const cmdArr = Array.isArray(cmds) ? cmds : [cmds]
                    if (cmdArr.some(c => (c instanceof RegExp ? c.test(command) : c === command))) {
                        plugin = p
                        break
                    }
                }
            }

            if (plugin) {
                try {
                    // Cek permission dari plugin
                    if (plugin.group    && !isGroup)   return reply('❌ Command ini hanya bisa dipakai di grup!')
                    if (plugin.private  && isGroup)    return reply('❌ Command ini hanya bisa dipakai di private chat!')
                    if (plugin.owner    && !isOwner)   return reply('❌ Command ini hanya untuk owner!')
                    if (plugin.admin    && !isAdmins && !isOwner) return reply('❌ Command ini hanya untuk admin grup!')
                    if (plugin.botAdmin && !isBotAdmin) return reply('❌ Bot harus jadi admin grup dulu!')

                    // Konteks yang dibutuhkan plugin Shiroko
                    const ctx = {
                        conn:        client,
                        m,
                        chatUpdate,
                        store,
                        args,
                        text,
                        usedPrefix:  prefix || '.',
                        command,
                        isOwner,
                        isAdmin:     isAdmins,
                        isBotAdmin,
                        isGroup,
                        groupMetadata,
                        groupAdmins,
                        // Util functions
                        sleep,
                        getBuffer,
                        fetchJson,
                        isUrl,
                        getRandom,
                        reply: (teks) => reply(teks),
                    }

                    // Jalankan plugin (bisa berupa fn biasa atau .default.call)
                    if (typeof plugin === 'function') {
                        await plugin.call(client, m, ctx)
                    } else if (typeof plugin.default === 'function') {
                        await plugin.default.call(client, m, ctx)
                    } else if (typeof plugin.code === 'function') {
                        await plugin.code.call(client, m, ctx)
                    }

                    return // Plugin sudah handle, skip switch di bawah
                } catch (e) {
                    if (e) {
                        // Throw string = pesan error yang ingin ditampilkan ke user
                        if (typeof e === 'string') return reply(e)
                        console.error(`[Plugin Error] ${command}:`, e.message || e)
                        return reply(`❌ Error: ${e.message || e}`)
                    }
                }
            }
        }

        // ════════════════════════════════════════════════════
        //  BUILT-IN COMMANDS
        // ════════════════════════════════════════════════════
        switch (command) {

            case 'tes': {
                await reply('✅ bot on kak.')
            }
            break

            case 'rvo':
            case 'readviewonce': {
                try {
                    if (!m.quoted) return reply('❌ Reply pesan viewOnce nya!')
                    const quotedMsg = m.quoted
                    const viewOnceMsg =
                        quotedMsg.message?.viewOnceMessage?.message ||
                        quotedMsg.message?.viewOnceMessageV2?.message ||
                        quotedMsg.message
                    const mediaMsg =
                        viewOnceMsg?.imageMessage ||
                        viewOnceMsg?.videoMessage ||
                        viewOnceMsg?.audioMessage
                    if (!mediaMsg || !mediaMsg.viewOnce) return reply('❌ Pesan itu bukan viewOnce!')
                    const mediaType = mediaMsg.mimetype?.includes('image') ? 'image'
                        : mediaMsg.mimetype?.includes('video') ? 'video' : 'audio'
                    const stream = await downloadContentFromMessage(mediaMsg, mediaType)
                    let buffer = Buffer.from([])
                    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
                    if      (/image/.test(mediaMsg.mimetype)) await client.sendMessage(m.chat, { image: buffer, caption: mediaMsg.caption || '' }, { quoted: m })
                    else if (/video/.test(mediaMsg.mimetype)) await client.sendMessage(m.chat, { video: buffer, caption: mediaMsg.caption || '' }, { quoted: m })
                    else if (/audio/.test(mediaMsg.mimetype)) await client.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mpeg', ptt: false }, { quoted: m })
                } catch (err) {
                    console.error('Error rvo:', err)
                    await reply('❌ Gagal membaca viewOnce.')
                }
            }
            break

            case 'menu':
            case 'start': {
                let timestampp = speed()
                let latensii   = speed() - timestampp
                let run        = process.uptime()
                let teks       = `${runtime(run)}`

                // Hitung total plugin yang berhasil dimuat
                const totalPlugins = Object.keys(global.plugins || {}).filter(k => !k.startsWith('cmd:')).length

                // Kumpulkan semua command dari plugin per kategori
                const categories = {}
                for (const name in (global.plugins || {})) {
                    if (name.startsWith('cmd:')) continue
                    const p = global.plugins[name]
                    const tag = (p?.tags?.[0] || p?.tags || 'lainnya').toString()
                    if (!categories[tag]) categories[tag] = []
                    const cmds = p?.command || p?.commands || []
                    const cmdArr = Array.isArray(cmds) ? cmds : [cmds]
                    categories[tag].push(...cmdArr.filter(Boolean))
                }

                // Build menu text per kategori
                let menuCategories = ''
                for (const [cat, cmds] of Object.entries(categories)) {
                    const uniqueCmds = [...new Set(cmds)]
                    menuCategories += `\n╭───「 ${cat.toUpperCase()} 」\n`
                    menuCategories += uniqueCmds.map(c => `│ ▢ ${prefix || '.'}${c}`).join('\n')
                    menuCategories += `\n╰──────────`
                }

                const menuText = `▢ system status
└──
  ├── ▢ speed   : ${latensii.toFixed(4)} sec
  ├── ▢ runtime : ${teks}
  ├── ▢ mode    : ${client.public ? 'public' : 'self'}
  ├── ▢ plugins : ${totalPlugins} loaded
  └── ▢ version : ${require('./package.json').version}

▢ user info
└──
  └── ▢ username : ${m.pushName}

▢ date & time
└──
  ├── ▢ tanggal : ${calendar}
  └── ▢ jam     : ${time} (Asia/Jakarta)
`
                let imgsc = await prepareWAMessageMedia(
                    { image: image },
                    { upload: client.waUploadToServer }
                )

                const menuCards = [
                    {
                        header: { title: '📌 Bot Information', hasMediaAttachment: true, ...imgsc },
                        body: { text: menuText },
                        footer: { text: 'Status & Information' },
                        nativeFlowMessage: {
                            buttons: [{
                                name: 'cta_url',
                                buttonParamsJson: JSON.stringify({
                                    display_text: '📥 Dapatkan Script',
                                    url: global.url,
                                    merchant_url: global.url
                                })
                            }]
                        }
                    },
                    {
                        header: { title: '⚙️ Main Menu', hasMediaAttachment: true, ...imgsc },
                        body: { text: `╭───「 Main 」\n│ ▢ .menu\n│ ▢ .public\n│ ▢ .self\n│ ▢ .tes\n╰──────────` },
                        footer: { text: 'Main Commands' },
                        nativeFlowMessage: {
                            buttons: [{
                                name: 'cta_url',
                                buttonParamsJson: JSON.stringify({
                                    display_text: '📢 Channel',
                                    url: global.url,
                                    merchant_url: global.url
                                })
                            }]
                        }
                    },
                    {
                        header: { title: '🛠 Convert Menu', hasMediaAttachment: true, ...imgsc },
                        body: { text: `╭───「 Convert 」\n│ ▢ .sticker\n│ ▢ .toimg\n│ ▢ .shorturl\n│ ▢ .tourl\n│ ▢ .rvo\n╰──────────` },
                        footer: { text: 'Converter Commands' },
                        nativeFlowMessage: {
                            buttons: [{
                                name: 'cta_url',
                                buttonParamsJson: JSON.stringify({
                                    display_text: '🧩 Telegram',
                                    url: 'https://t.me/paiexea',
                                    merchant_url: 'https://t.me'
                                })
                            }]
                        }
                    }
                ]

                const msg = generateWAMessageFromContent(
                    m.chat,
                    proto.Message.fromObject({
                        viewOnceMessage: {
                            message: {
                                interactiveMessage: {
                                    contextInfo: {
                                        mentionedJid: [m.sender],
                                        forwardingScore: 999,
                                        isForwarded: true
                                    },
                                    body: { text: `*${global.botName}*` },
                                    footer: { text: `Plugin System | ${totalPlugins} fitur aktif` },
                                    carouselMessage: { cards: menuCards }
                                }
                            }
                        }
                    }),
                    { userJid: m.chat, quoted: m }
                )

                await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
            }
            break

            case 'public': {
                if (!isOwner) return
                reply('✅ Berhasil ubah ke mode public')
                client.public = true
            }
            break

            case 'self': {
                if (!isOwner) return
                reply('✅ Berhasil ubah ke mode self')
                client.public = false
            }
            break

            case 's':
            case 'sticker':
            case 'stiker': {
                if (/image/.test(mime)) {
                    let media = await quoted.download()
                    await client.sendImageAsSticker(m.chat, media, m, { packname: global.packname, author: global.author })
                } else if (/video/.test(mime)) {
                    if ((quoted.msg || quoted).seconds > 11) return reply(`Reply gambar dengan caption ${prefix + command}\nJika video, batas maksimal 1-9 detik`)
                    let media = await quoted.download()
                    await client.sendVideoAsSticker(m.chat, media, m, { packname: global.packname, author: global.author })
                } else {
                    reply(`Reply gambar dengan caption ${prefix + command}\nJika video, durasi maks 1-9 detik`)
                }
            }
            break

            case 'toimage':
            case 'toimg': {
                if (!/webp/.test(mime)) return reply(`Reply sticker dengan command *${prefix + command}*`)
                let media = await client.downloadAndSaveMediaMessage(qmsg)
                let ran   = await getRandom('.png')
                exec(`ffmpeg -i ${media} ${ran}`, (err) => {
                    fs.unlinkSync(media)
                    if (err) return
                    let buffer = fs.readFileSync(ran)
                    client.sendMessage(m.chat, { image: buffer }, { quoted: m })
                    fs.unlinkSync(ran)
                })
            }
            break

            case 'shortlink':
            case 'shorturl': {
                if (!text) return reply(`Contoh : ${prefix + command} https://example.com`)
                if (!isUrl(text)) return reply(`URL tidak valid. Contoh : ${prefix + command} https://example.com`)
                var res  = await axios.get('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(text))
                var link = `\n*Shortlink by TinyURL*\n${res.data.toString()}`
                await reply(link)
            }
            break

            case 'tourl': {
                if (!/video/.test(mime) && !/image/.test(mime)) return reply(`Reply gambar/video dengan caption ${prefix + command}`)
                let pnis  = m.quoted ? m.quoted : m
                let media = await pnis.download()
                let link  = await TelegraPh(media)
                await sleep(1000)
                await reply(`${link}`)
            }
            break

            default:
                if (body.startsWith('<')) {
                    if (!isOwner) return
                    try {
                        const output = await eval(`(async () => ${q})()`)
                        await m.reply(`${typeof output === 'string' ? output : JSON.stringify(output, null, 4)}`)
                    } catch (e) {
                        await m.reply(`Error: ${String(e)}`)
                    }
                }
                if (budy.startsWith('>')) {
                    if (!isOwner) return
                    try {
                        let evaled = await eval(q)
                        if (typeof evaled !== 'string') evaled = util.inspect(evaled)
                        await m.reply(evaled)
                    } catch (e) {
                        await m.reply(`Error: ${String(e)}`)
                    }
                }
                if (budy.startsWith('$')) {
                    if (!isOwner) return
                    exec(q, (err, stdout) => {
                        if (err)    return m.reply(err.toString())
                        if (stdout) return m.reply(stdout.toString())
                    })
                }
        }

    } catch (e) {
        console.log(e)
    }
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(`Update ${__filename}`)
    delete require.cache[file]
    require(file)
})
