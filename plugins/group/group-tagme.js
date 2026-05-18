let handler = async (m, { conn }) => {
  conn.sendMessage(
    m.chat,
    {
      text: "@" + m.sender.split("@")[0],
      mentions: [m.sender]
    },
    { quoted: m }
  );
};

handler.help = ["tagme *[tag yourself]*"];
handler.tags = ["group"];
handler.command = ["tagme"];
handler.group = true;

export default handler;