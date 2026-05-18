import yts from "yt-search";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    throw `Contoh: ${usedPrefix + command} cupid`;
  }

  m.reply(wait);

  try {
    const results = await yts(text);
    const res = results.all[0];
    if (!res) throw "❌ Video tidak ditemukan";

    const {
      title,
      thumbnail,
      timestamp,
      views,
      ago,
      url
    } = res;

    const caption = `
*${title}*

⏱️ *Durasi:* ${timestamp}
👁️ *Views:* ${views}
📤 *Upload:* ${ago}
🔗 *Link:* ${url}
`.trim();

    await conn.sendButtonV2(
      m.chat,
      {
        caption,
        footer: wm,
        image: { url: thumbnail },
        hasMediaAttachment: true,
        buttons: [
          {
            text: "🎵 Audio",
            id: `${usedPrefix}yta ${url}`
          },
          {
            text: "🎬 Video",
            id: `${usedPrefix}ytv ${url}`
          }
        ]
      },
      { quoted: m }
    );

  } catch (e) {
    console.error(e);
    throw "❌ Terjadi kesalahan saat mengambil video";
  }
};

handler.help = ["play"];
handler.tags = ["downloader"];
handler.command = /^(play)$/i;
handler.limit = true;

export default handler;