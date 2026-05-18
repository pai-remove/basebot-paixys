import pkg from "akiraa-wb";
const {Lib} = pkg;

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (m.quoted ? m.quoted : m.msg).mimetype || "";
  if (/mp3|a(udio)?$/i.test(command)) {
    if (!/video|audio/.test(mime))
      throw `*• Example :* ${usedPrefix + command} *[reply video/vn/audio]*`;
    let media = await q.download();
    if (!media) return;
    let audio = await Lib.converter.toAudio(media, "mp4");
    if (!audio.data) throw `*Can't Converted* Try again !`;
    await conn.sendFile(m.chat, audio.data, "file.mp3", "", m, 0, {
      mimetype: "audio/mp4",
    });
  }
  if (/vn|ptt$/i.test(command)) {
    if (!/video|audio/.test(mime))
      throw `*• Example :* ${usedPrefix + command} *[reply video/vn/audio]*`;
    let media = await q.download();
    if (!media) return;
    let audio = await Lib.converter.toPTT(media, "mp4");
    if (!audio.data) throw `*Can't Converted* Try again !`;
    await conn.sendFile(m.chat, audio.data, "file.mp4", "", m, 1, {
      mimetype: "audio/mp4",
    });
  }
};

handler.help = ["tomp3", "tovn"].map((a) => a + " *[reply video/vn/audio]*");
handler.tags = ["tools"];
handler.command = ["tomp3", "tovn"];

export default handler;
