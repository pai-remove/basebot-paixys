let handler = async (m, { isAdmin, isOwner, conn, command }) => {
  conn.groupRevokeInvite(m.chat);
  conn.reply(m.chat, `Successs Revoke Link Group !`, m);
  await delay(1000);
  let linknya = await conn.groupInviteCode(m.chat);
  conn.reply(m.sender, "https://chat.whatsapp.com/" + linknya, m);
};
handler.help = ["revoke"].map((a) => a + " *[reset link]*");
handler.tags = ["group"];
handler.command = ["revoke"];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;

const delay = (time) => new Promise((res) => setTimeout(res, time));
