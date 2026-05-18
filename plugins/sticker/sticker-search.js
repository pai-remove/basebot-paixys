import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Masukkan text yang ingin dicari`);

    const url = `https://api.diioffc.web.id/api/search/stickersearch?query=${encodeURIComponent(text)}`;

    try {
        const response = await axios.get(url);
        if (response.data && response.data.status) {
            const result = response.data.result;
            const stickers = result.sticker;
            
            if (stickers && stickers.length > 0) {
                const stickerUrl = stickers[Math.floor(Math.random() * stickers.length)];
                await conn.sendImageAsSticker(
                    m.chat,
                    stickerUrl,
                    m,
                    { packname: global.packname, author: global.author }
                );
            } else {
                m.reply("Sticker tidak ditemukan.");
            }
        } else {
            m.reply("Sticker tidak ditemukan atau terjadi error pada API.");
        }
    } catch (error) {
        console.error(error);
        m.reply("Terjadi error saat mengambil data sticker.");
    }
};

handler.help = ['stickersearch'];
handler.command = ['stickersearch'];
handler.tags = ['sticker'];
handler.limit = true;
handler.register = true;

export default handler;