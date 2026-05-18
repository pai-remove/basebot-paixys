// ============================================================
//  CONFIG — BotGabungan
//  Ganti nilai di bawah sesuai kebutuhanmu
// ============================================================

// ── Bot Identity ────────────────────────────────────────────
global.owner          = ['6283183405397']       // Nomor owner (awali 62)
global.pairingNumber  = '6281330586274'         // Nomor bot (awali 62)
global.connect        = true                    // true = pairing code | false = QR code
global.url            = 'https://t.me/paiexea'
global.url2           = 'false'
global.packname       = 'ραι - ѕуχ'
global.author         = 'ραι - ѕуχ'
global.botName        = 'BotGabungan'
global.nomorown       = global.owner[0]

// ── Prefix ──────────────────────────────────────────────────
global.prefix         = /^[.!#÷×/]/

// ── Timezone ────────────────────────────────────────────────
process.env.TZ        = 'Asia/Jakarta'

// ── Limit System ────────────────────────────────────────────
global.maxLimit       = 100

// ── API Keys ─────────────────────────────────────────────────
global.geminiKey      = 'ISI_API_KEY_GEMINI_DISINI'
// https://aistudio.google.com/app/apikey

global.openaiKey      = 'ISI_API_KEY_OPENAI_DISINI'
// https://platform.openai.com/api-keys

global.removebgKey    = 'ISI_API_KEY_REMOVEBG_DISINI'
// https://www.remove.bg/api

global.sswKey         = 'ISI_API_KEY_SCREENSHOT_DISINI'
// https://screenshotapi.net/

global.rapidapiKey    = 'ISI_API_KEY_RAPIDAPI_DISINI'
// https://rapidapi.com/

global.ocrKey         = 'ISI_API_KEY_OCRSPACE_DISINI'
// https://ocr.space/ocrapi

global.acrHost        = 'ISI_ACRCLOUD_HOST_DISINI'
global.acrKey         = 'ISI_ACRCLOUD_ACCESS_KEY_DISINI'
global.acrSecret      = 'ISI_ACRCLOUD_SECRET_DISINI'
// https://console.acrcloud.com/

global.prodiaKey      = 'ISI_API_KEY_PRODIA_DISINI'
// https://prodia.com/

global.spotifyId      = 'ISI_SPOTIFY_CLIENT_ID_DISINI'
global.spotifySecret  = 'ISI_SPOTIFY_CLIENT_SECRET_DISINI'
// https://developer.spotify.com/dashboard

global.hfKey          = 'ISI_API_KEY_HUGGINGFACE_DISINI'
// https://huggingface.co/settings/tokens

global.imagekitPublic  = 'ISI_IMAGEKIT_PUBLIC_KEY_DISINI'
global.imagekitPrivate = 'ISI_IMAGEKIT_PRIVATE_KEY_DISINI'
global.imagekitUrl     = 'ISI_IMAGEKIT_URL_ENDPOINT_DISINI'
// https://imagekit.io/dashboard

global.mongoUrl       = ''

// ── Feature Toggles ─────────────────────────────────────────
global.autoRead       = false
global.autoTyping     = false
global.swOnly         = false
global.antiSpam       = true
