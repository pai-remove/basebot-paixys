import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

async function removeBG(url) {
  try {
    const formData = new FormData();
    formData.append("size", "auto");
    formData.append("image_url", url);

    let { data } = await axios({
      method: "post",
      url: "https://api.remove.bg/v1.0/removebg",
      data: formData,
      responseType: "arraybuffer",
      headers: {
        ...formData.getHeaders(),
        "X-Api-Key": "wjw84kiS5YHF6WP5ncgk9ckj",
      },
      encoding: null,
    });

    return { status: true, buffer: data };
  } catch (e) {
    return { status: false, msg: "Failed Request !" };
  }
}

let handler = async (m, { conn, usedPrefix, command, text }) => {
  let who =
    m.mentionedJid && m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.fromMe
        ? conn.user.jid
        : m.sender;
  let name = await conn.getName(who);
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";
  if (!mime) throw `*• Example :* ${usedPrefix + command} *[reply/send media]*`;
  m.reply(wait);
  let media = await q.download();
  let url = await Uploader.Uguu(media);
  let hasil = await removeBG(url);
  await conn.sendFile(m.chat, hasil.buffer, "", done, m);
};
handler.help = ["removebg", "nobg"].map((a) => a + " *[reply/send media]*");
handler.tags = ["tools"];
handler.command = ["removebg", "nobg"];
handler.limit = true;

export default handler;
