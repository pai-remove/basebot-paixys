import fetch from "node-fetch";

const handler = async (m, { conn, text, command, usedPrefix }) => {
  if (!text) {
    return m.reply(
      `${usedPrefix + command} https://www.capcut.com/template-detail/7442103570402446645?template_id=7442103570402446645&share_token=3ff5f0f9-40fc-43b4-8716-6097735e419a&enter_from=template_detail&region=ID&language=in&platform=copy_link&is_copy_link=1`
    );
  }

  m.reply('Proses 🗿');

  try {
    const res = await fetch(`https://api.diioffc.web.id/api/download/capcut?url=${encodeURIComponent(text)}`);
    const response = await res.json();

    if (!response.result) throw 'Download failed 🗿';

    conn.sendMessage(
      m.chat, 
      { 
        video: { url: response.result.originalVideoUrl }, 
        mimetype: 'video/mp4', 
        caption: response.result.title 
      }, 
      { quoted: m }
    );
  } catch (err) {
    m.reply('Error 🗿');
  }
};

handler.command = ['capcut'];
handler.tags = ['downloader'];
handler.help = ['capcut *[url]*'];

export default handler;