# BotGabungan v2.0

Base bot WhatsApp (Pai SYX) yang sudah digabung dengan plugin-plugin dari **ShirokoFork v3**.

## ✨ Fitur yang Ditambahkan

| Kategori | Jumlah Plugin | Contoh Perintah |
|----------|:---:|---|
| 🎮 Game | 26 | `.blackjack`, `.tebakkata`, `.tebaklirik`, `.tebakbendera`, `.dadu`, `.hangman`, `.chess` |
| ⬇️ Downloader | 14 | `.tiktok`, `.ytv`, `.yta`, `.ig`, `.fb`, `.spotify`, `.twitter`, `.capcut` |
| 👥 Group | 17 | `.welcome`, `.antilink`, `.kick`, `.promote`, `.hidetag`, `.votekick`, `.poll` |
| 🎉 Fun | 20 | `.khodam`, `.roasting`, `.cerpen`, `.cekcantik`, `.dare`, `.menfess` |
| 💬 Quotes | 12 | `.qanime`, `.gombal`, `.pantun`, `.galau`, `.islami` |
| 🛠️ Tools | 23 | `.translate`, `.removebg`, `.qr`, `.ssweb`, `.toimg`, `.whatmusic`, `.logo` |
| 🎌 Anime | 17 | `.ongoing`, `.topanime`, `.waifu`, `.genshin`, `.bluearchive`, `.manga` |
| 🎨 Sticker | 9 | `.sticker`, `.stiker`, `.emojimix`, `.blush`, `.slap`, `.dance` |
| 🎭 Maker | 3 | `.ephoto`, `.carbon`, `.qc` |
| 💰 RPG | 24 | `.dompet`, `.kerja`, `.mancing`, `.judi`, `.jackpot`, `.dungeon`, `.daily` |

**Total: 165+ plugin aktif**

---

## 🚀 Cara Install

```bash
npm install
node index.js
```

---

## ⚙️ Konfigurasi

Edit file `settings/config.js`:

1. **Ganti nomor owner dan nomor bot**
2. **Isi API key** yang dibutuhkan (cek komentar di config.js untuk link daftarnya)

### API Key yang Perlu Diisi (sesuai fitur yang dipakai):

| API | Dibutuhkan Untuk | Link Daftar |
|-----|---|---|
| `geminiKey` | Fitur AI Gemini | https://aistudio.google.com/app/apikey |
| `openaiKey` | Fitur ChatGPT | https://platform.openai.com/api-keys |
| `removebgKey` | Remove background foto | https://www.remove.bg/api |
| `rapidapiKey` | Downloader TikTok, dll | https://rapidapi.com |
| `sswKey` | Screenshot website | https://screenshotapi.net |
| `spotifyId/Secret` | Download lagu Spotify | https://developer.spotify.com/dashboard |
| `acrKey` | Deteksi musik (whatmusic) | https://console.acrcloud.com |
| `hfKey` | AI HuggingFace | https://huggingface.co/settings/tokens |

> Kalau tidak isi API key, fitur yang bersangkutan tetap bisa dipanggil tapi akan error saat dijalankan.

---

## 📁 Struktur Folder

```
BotGabungan/
├── index.js              ← Entry point
├── bot.js                ← Handler utama + Plugin Dispatcher
├── settings/
│   └── config.js         ← Konfigurasi & API keys
├── plugins/              ← Semua plugin (auto-load)
│   ├── game/
│   ├── downloader/
│   ├── group/
│   ├── fun/
│   ├── quotes/
│   ├── tools/
│   ├── anime/
│   ├── sticker/
│   ├── maker/
│   └── rpg/
└── storage/
    ├── lib/
    │   ├── pluginLoader.js  ← Sistem loader plugin ESM→CJS
    │   ├── myfunc.js
    │   ├── converter.js
    │   └── shiroko/         ← Lib dari ShirokoFork (canvas, func, dll)
    └── database/
        ├── database.json
        ├── image.json
        └── jadwaltv.json
```

---

## 🔧 Menambah Plugin Baru

Taruh file `.js` di folder `plugins/<kategori>/`. Plugin akan **auto-load** tanpa perlu restart bot.

Format plugin yang didukung:
```js
// Format 1: function + properti (Shiroko style)
let handler = async (m, { conn, text, usedPrefix, command }) => {
    // kode plugin
}
handler.command = ['namacommand']
handler.tags = ['kategori']
export default handler

// Format 2: object dengan code
export default {
    command: ['namacommand'],
    tags: ['kategori'],
    code: async (m, { conn, text }) => {
        // kode plugin
    }
}
```

---

*Base: Pai SYX | Plugin: ShirokoFork v3*
