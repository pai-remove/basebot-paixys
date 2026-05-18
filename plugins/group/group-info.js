let handler = async (m, { conn, text, usedPrefix, command, groupMetadata }) => {
  let data = groupMetadata;
  let pp;
  try {
    pp = await conn.profilePictureUrl(m.chat, "image");
  } catch (e) {
    pp = thumb;
  }
  let cap = `*[ GROUP INFOMATION ]*
*• ID :* *[ ${data.id} ]*
*• Subject :* ${data.subject}
*• Total Member :* ${data.size}
*•  Accept New member :* ${data.joinApprovalMode ? "[ ✓ ]" : "[ x ]"}
*• Add Others Member :* ${data.memberAddMode ? "[ ✓ ]" : "[ x ]"}
*• Message Restrict :*  ${data.restrict ? "[ ✓ ]" : "[ x ]"}

${data.desc}
`;
  await conn.sendMessage(
    m.chat,
    {
      image: {
        url: pp,
      },
      caption: cap,
      mentions: await conn.parseMention(cap),
    },
    { quoted: m },
  );
};
handler.help = ["infogroup"].map((a) => a + " *[get Info group]*");
handler.tags = ["group"];
handler.command = ["infogroup"];
handler.group = true;

export default handler;
