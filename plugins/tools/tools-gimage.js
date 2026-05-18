import axios from 'axios';

async function gimage(teks) {
  try {
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        q: teks,
        key: 'AIzaSyAajE2Y-Kgl8bjPyFvHQ-PgRUSMWgBEsSk',
        cx: 'e5c2be9c3f94c4bbb',
        searchType: 'image',
      },
    });
    return response.data.items || [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply('Silakan masukkan kata kunci pencarian gambar.');
  }

  let results = await gimage(text);
  if (!results.length) {
    return m.reply('Tidak ditemukan hasil untuk pencarian gambar tersebut.');
  }

  let image = results[0];

  let caption = `*Hasil Pencarian Gambar Google untuk:* "${text}"\n`;
  caption += `*Judul:* ${image.title || 'Tidak tersedia'}\n`;
  caption += `*Sumber:* ${image.displayLink || 'Tidak tersedia'}`;

  conn.sendMessage(
    m.chat,
    {
      image: { url: image.link },
      caption: caption,
    },
    { quoted: m }
  );
};

handler.help = ["gimage"].map((a) => a + " *[kata kunci]*");
handler.tags = ["tools"];
handler.command = ["gimage"];

export default handler;