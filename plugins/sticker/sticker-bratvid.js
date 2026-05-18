import axios from "axios";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*• Example :* ${usedPrefix + command} *[input text]*`;

  try {
    // API ambil hasil gif/mp4
    let apiUrl = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text)}&isAnimated=true&delay=500`;
    let res = await axios.get(apiUrl, { responseType: "arraybuffer" });

    // kirim sebagai sticker gif (animasi)
    let stiker = await conn.sendImageAsSticker(m.chat, res.data, m, {
      packname: packname,
      author: author,
    });

    if (!stiker) throw new Error("Gagal convert brat video ke sticker GIF");
  } catch (err) {
    console.error(err);
    m.reply("Terjadi kesalahan saat membuat stiker brat gif.");
  }
};

handler.help = ["bratvid <text>"];
handler.tags = ["sticker"];
handler.command = /^bratvid$/i;
handler.limit = true;
handler.register = true;

export default handler;