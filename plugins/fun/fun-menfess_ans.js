const delay = (time) => new Promise((res) => setTimeout(res, time));
let handler = (m) => m;

handler.before = async function (m, { conn }) {
  if (!m.chat.endsWith("@s.whatsapp.net")) return !0;
  this.menfess = this.menfess ? this.menfess : {};
  let room = Object.values(this.menfess).find((room) =>
    [room.dari, room.penerima].includes(m.sender),
  );
  if (m.text === "stop") {
    let other = [room.dari, room.penerima].find((user) => user !== m.sender);
    conn.reply(other, "🏳️ Menfess Di hentikan", null);
    delete this.menfess[room.id];
  } else if (room) {
    let other = [room.dari, room.penerima].find((user) => user !== m.sender);
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";
    if (mime) {
      m.copyNForward(
        other,
        true,
        m.quoted && m.quoted.fromMe
          ? {
              contextInfo: {
                ...m.msg.contextInfo,
                forwardingScore: 1,
                isForwarded: true,
                participant: other,
              },
            }
          : {},
      );
    } else {
      conn.reply(other, "*_[ 💬 ] Pesan Menfess:_* " + m.text, null);
    }
  }
  return !0;
};

export default handler;
