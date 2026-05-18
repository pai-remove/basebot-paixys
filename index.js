require('./settings/config')

const pino = require('pino')
const chalk = require('chalk')
const { exec } = require('child_process')
const readline = require('readline')
const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const yargs = require('yargs/yargs')
const { smsg, sleep, getBuffer, getRandom, getGroupAdmins } = require('./storage/lib/myfunc.js')
const listcolor = ['cyan', 'magenta', 'green', 'yellow', 'blue']
const randomcolor = listcolor[Math.floor(Math.random() * listcolor.length)]
const { color } = require('./storage/lib/color.js')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./storage/lib/exif')
const FileType = require('file-type')
const axios = require('axios')

const low = require('lowdb')
const Low = low
const JSONFile = require('lowdb/adapters/FileSync')
const mongoDB = require('./storage/lib/mongoDB')

const question = (text) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    return new Promise((resolve) => {
        rl.question(color(text, randomcolor), (answer) => {
            resolve(answer)
            rl.close()
        })
    })
}

const start = async () => {
    // Load baileys pakai dynamic import karena pure ESM
    const baileys = await import('@whiskeysockets/baileys')
    const makeWAsocket = baileys.default

    const {
        useMultiFileAuthState,
        DisconnectReason,
        fetchLatestBaileysVersion,
        generateForwardMessageContent,
        prepareWAMessageMedia,
        generateWAMessageFromContent,
        downloadContentFromMessage,
        jidDecode,
        proto,
        makeCacheableSignalKeyStore,
        Browsers,
        MessageRetryMap
    } = baileys

    // Simpan ke global biar bot.js bisa pakai
    global.baileysFuncs = {
        downloadContentFromMessage,
        prepareWAMessageMedia,
        generateWAMessageFromContent,
        proto,
        Browsers,
    }

    let Boom
    try { Boom = require('@hapi/boom').Boom }
    catch (e) { Boom = (await import('@hapi/boom')).Boom }

    // store sederhana karena makeInMemoryStore sudah dihapus di baileys terbaru
    const store = { contacts: {} }

    const { state, saveCreds } = await useMultiFileAuthState('./session')
    const { version } = await fetchLatestBaileysVersion()

    const client = makeWAsocket({
        version,
        keepAliveIntervalMs: 10000,
        printQRInTerminal: !global.connect,
        logger: pino({ level: 'silent' }),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
        },
        browser: Browsers.ubuntu('Edge'),
        generateHighQualityLinkPreview: true,
        markOnlineOnConnect: false,
    })

    if (global.connect && !client.authState.creds.registered) {
        await sleep(3000)
        const phoneNumber = global.pairingNumber || await question('Masukkan nomor bot (awali 62): \n')
        const togel = phoneNumber.replace(/[^0-9]/g, '')
        let pairCode = await client.requestPairingCode(togel.trim())
        pairCode = pairCode?.match(/.{1,4}/g)?.join('-')
        console.log(chalk.bgGreen(chalk.black('PAIRING CODE')), chalk.white(pairCode))
    }

    global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
    global.db = new Low(new JSONFile('./storage/database/database.json'))
    global.DATABASE = global.db
    global.loadDatabase = async function loadDatabase() {
        if (global.db.READ) return new Promise((resolve) => setInterval(function () {
            if (!global.db.READ) { clearInterval(this); resolve(global.db.data == null ? global.loadDatabase() : global.db.data) }
        }, 1000))
        if (global.db.data !== null) return
        global.db.READ = true
        await global.db.read()
        global.db.READ = false
        global.db.data = {
            users: {}, chats: {}, game: {}, database: {},
            settings: {}, setting: {}, others: {}, sticker: {},
            ...(global.db.data || {})
        }
        global.db.chain = _.chain(global.db.data)
    }
    loadDatabase()

    if (global.db) setInterval(async () => {
        if (global.db.data) await global.db.write()
    }, 30 * 1000)

    client.ev.on('creds.update', saveCreds)

    client.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && `${decode.user}@${decode.server}` || jid
        }
        return jid
    }

    client.sendText = (jid, text, quoted = '', options) =>
        client.sendMessage(jid, { text, ...options }, { quoted, ...options })

    client.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update

        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason === DisconnectReason.loggedOut) {
                console.log(color('Logged out, hapus session dan scan ulang.', 'red'))
                exec('rm -rf ./session/*')
                process.exit(1)
            } else {
                console.log(color('Koneksi putus, mencoba reconnect...', 'red'))
                start()
            }
        }

        if (connection === 'open') {
            console.log(color('✅ WhatsApp Connected!', 'green'))
            console.log(color('Bot Number: ' + client.user.id.split(':')[0], 'cyan'))
        }
    })

    client.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = client.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
        }
    })

    client.public = true

    client.getName = (jid, withoutContact = false) => {
        let id = client.decodeJid(jid)
        withoutContact = client.withoutContact || withoutContact
        let v
        if (id.endsWith('@g.us')) {
            return new Promise(async (resolve) => {
                v = store.contacts[id] || {}
                if (!(v.name || v.subject)) v = await client.groupMetadata(id) || {}
                resolve(v.name || v.subject || id)
            })
        } else {
            v = id === '0@s.whatsapp.net' ? { id, name: 'WhatsApp' }
                : id === client.decodeJid(client.user.id) ? client.user
                : (store.contacts[id] || {})
            return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || id
        }
    }

    client.serializeM = (m) => smsg(client, m, store)

    client.sendImage = async (jid, filePath, caption = '', quoted = '', options) => {
        let buffer = Buffer.isBuffer(filePath) ? filePath
            : /^data:.?\/.?;base64,/i.test(filePath) ? Buffer.from(filePath.split`,`[1], 'base64')
            : /^https?:\/\//.test(filePath) ? await getBuffer(filePath)
            : fs.existsSync(filePath) ? fs.readFileSync(filePath)
            : Buffer.alloc(0)
        return client.sendMessage(jid, { image: buffer, caption, ...options }, { quoted })
    }

    client.sendVideo = async (jid, filePath, caption = '', quoted = '', gif = false, options) => {
        let buffer = Buffer.isBuffer(filePath) ? filePath
            : /^data:.?\/.?;base64,/i.test(filePath) ? Buffer.from(filePath.split`,`[1], 'base64')
            : /^https?:\/\//.test(filePath) ? await getBuffer(filePath)
            : fs.existsSync(filePath) ? fs.readFileSync(filePath)
            : Buffer.alloc(0)
        return client.sendMessage(jid, { video: buffer, caption, gifPlayback: gif, ...options }, { quoted })
    }

    client.sendAudio = async (jid, filePath, quoted = '', ptt = false, options) => {
        let buffer = Buffer.isBuffer(filePath) ? filePath
            : /^data:.?\/.?;base64,/i.test(filePath) ? Buffer.from(filePath.split`,`[1], 'base64')
            : /^https?:\/\//.test(filePath) ? await getBuffer(filePath)
            : fs.existsSync(filePath) ? fs.readFileSync(filePath)
            : Buffer.alloc(0)
        return client.sendMessage(jid, { audio: buffer, ptt, ...options }, { quoted })
    }

    client.sendImageAsSticker = async (jid, filePath, quoted, options = {}) => {
        let buff = Buffer.isBuffer(filePath) ? filePath
            : /^data:.?\/.?;base64,/i.test(filePath) ? Buffer.from(filePath.split`,`[1], 'base64')
            : /^https?:\/\//.test(filePath) ? await getBuffer(filePath)
            : fs.existsSync(filePath) ? fs.readFileSync(filePath)
            : Buffer.alloc(0)
        let buffer = (options.packname || options.author) ? await writeExifImg(buff, options) : await imageToWebp(buff)
        return client.sendMessage(jid, { sticker: buffer, ...options }, { quoted })
    }

    client.sendVideoAsSticker = async (jid, filePath, quoted, options = {}) => {
        let buff = Buffer.isBuffer(filePath) ? filePath
            : /^data:.?\/.?;base64,/i.test(filePath) ? Buffer.from(filePath.split`,`[1], 'base64')
            : /^https?:\/\//.test(filePath) ? await getBuffer(filePath)
            : fs.existsSync(filePath) ? fs.readFileSync(filePath)
            : Buffer.alloc(0)
        let buffer = (options.packname || options.author) ? await writeExifVid(buff, options) : await videoToWebp(buff)
        return client.sendMessage(jid, { sticker: buffer, ...options }, { quoted })
    }

    client.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
        let type = await FileType.fromBuffer(buffer)
        let trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }

    client.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
        return buffer
    }

    client.copyNForward = async (jid, message, forceForward = false, options = {}) => {
        let mtype = Object.keys(message.message)[0]
        let content = await generateForwardMessageContent(message, forceForward)
        let ctype = Object.keys(content)[0]
        let context = mtype !== 'conversation' ? message.message[mtype].contextInfo : {}
        content[ctype].contextInfo = { ...context, ...content[ctype].contextInfo }
        const waMessage = await generateWAMessageFromContent(jid, content, { ...content[ctype], ...options })
        await client.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id })
        return waMessage
    }

    client.cMod = (jid, copy, text = '', sender = client.user.id, options = {}) => {
        let mtype = Object.keys(copy.message)[0]
        let isEphemeral = mtype === 'ephemeralMessage'
        if (isEphemeral) mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
        let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
        let content = msg[mtype]
        if (typeof content === 'string') msg[mtype] = text || content
        else if (content.caption) content.caption = text || content.caption
        else if (content.text) content.text = text || content.text
        if (typeof content !== 'string') msg[mtype] = { ...content, ...options }
        if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
        copy.key.remoteJid = jid
        copy.key.fromMe = sender === client.user.id
        return proto.WebMessageInfo.fromObject(copy)
    }

    client.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            let mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage')
                ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return
            let m = smsg(client, mek, store)
            require('./bot.js')(client, m, chatUpdate, store)
        } catch (err) {
            console.log(err)
        }
    })

    return client
}

start()

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})
