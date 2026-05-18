import axios from 'axios';
import fs from 'fs';
import moment from "moment-timezone";

const handler = async (m, {
    conn,
    text,
    usedPrefix
}) => {
    if (!text) throw `Gunakan perintah ini dengan format: ${usedPrefix}brat <teks>`;
    if (m.text.length >= 50) throw `[❗] *You Can't Use Brat Because It's Oversized You Can't Use Brat Because You're Over 50 Text*`;
    try {
        let name = m.pushName || conn.getName(m.sender);

        conn.sendMessage(m.chat, {
            react: {
                text: '✔️',
                key: m.key
            }
        });
        const url = `https://brat.caliphdev.com/api/brat?text=${encodeURIComponent(text)}`;
        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        });

        const tempFilePath = `./temp_${new Date().getTime()}.jpg`;

        fs.writeFileSync(tempFilePath, response.data);

        await conn.sendImageAsSticker(m.chat, tempFilePath, m, {
            packname: `Time : ${moment.tz("Asia/Makassar")}\n`,
            author: `Created By ${m.name}\nShiroko MD`,
        });

        await fs.unlinkSync(tempFilePath);


    } catch {
        let name = m.pushName || conn.getName(m.sender);
        conn.sendMessage(m.chat, {
            react: {
                text: '✔️',
                key: m.key
            }
        });

        const url = `https://aqul-brat.hf.space/api/brat?text=${encodeURIComponent(text)}`;
        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        });
        const tempFilePath = `./temp_${new Date().getTime()}.jpg`;
        fs.writeFileSync(tempFilePath, response.data);
        await conn.sendImageAsSticker(m.chat, tempFilePath, m, {
            packname: `Time : ${moment.tz("Asia/Makassar")}\n`,
            author: `Created By ${m.name}\nShiroko MD`,
        });
        await fs.unlinkSync(tempFilePath);
    }
};

handler.help = ['brat'].map((a) => a + " *[text]*");
handler.tags = ['sticker'];
handler.command = /^brat$/i;
handler.limit = true;
handler.register = true;

export default handler;