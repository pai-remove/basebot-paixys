import axios from 'axios';
import * as cheerio from 'cheerio';

const handler = async (m, { conn }) => {
    async function konachan() {
        try {
            let { data } = await axios.get('https://konachan.net/post?tags=order%3Arandom');
            let $ = cheerio.load(data);
            let img = [];
            $('#post-list-posts a.directlink.largeimg').each((index, element) => {
                const gtw = $(element).attr('href');
                img.push(gtw);
            });
            let imgg = img[Math.floor(Math.random() * img.length)];
            return imgg;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    try {
        m.reply('Waitt...');
        const imageUrl = await konachan();
        if (imageUrl) {
            conn.sendMessage(m.chat, { image: { url: imageUrl }, caption: 'Donee!!' }, { quoted: m });
        } else {
            m.reply('Gagal mengambil gambar dari Konachan!');
        }
    } catch (err) {
        console.error(err);
        m.reply('Terjadi kesalahan!');
    }
};

handler.help = ['konachan'];
handler.tags = ['anime'];
handler.command = /^(konachan)$/i;

export default handler;