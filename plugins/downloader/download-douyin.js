import fetch from "node-fetch";

const handler = async (m, { text, command }) => {
  if (!text) return m.reply(`${command} https://v.douyin.com/ifRC7nwE/`);

  m.reply('Proses 🗿');
  try {
    const res = await fetch(`https://api.diioffc.web.id/api/download/douyin?url=${encodeURIComponent(text)}`);
    const response = await res.json();

    await conn.sendMessage(m.chat, {
      video: { url: response.result.Video_HD },
      mimetype: 'video/mp4',
      caption: response.result.description
    }, { quoted: m });

    setTimeout(() => {
      conn.sendMessage(m.chat, {
        audio: { url: response.result.Audio },
        mimetype: "audio/mpeg",
        contextInfo: {
          externalAdReply: {
            thumbnailUrl: null,
            title: response.result.description,
            body: null,
            sourceUrl: null,
            renderLargerThumbnail: true,
            mediaType: 1
          }
        }
      }, { quoted: m });
    }, 3000);
  } catch (err) {
    m.reply('Error 🗿');
  }
};

handler.command = ['douyin'];
handler.help = ['douyin <url>'];
handler.tags = ['downloader'];
handler.limit = true;

export default handler;