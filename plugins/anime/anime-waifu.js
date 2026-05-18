let handler = async (m, { conn, text, usedPrefix, command }) => {
  let res = await Func.fetchJson(
    "https://www.vilipix.com/api/v1/picture/recommand?limit=1&offset=10",
  );
  let data = await Func.random(res.data.rows);
  let cap = `*[ RANDOM WAIFU ]*
*• Title :* ${data.title}
*• Tags :* ${data.tags}
*• create at :* ${data.created_at}`;

  await conn.sendButtonV2(
      m.chat,
      {
        caption,
        footer: global.wm2,
        image: { url: random.urls.regular },
        hasMediaAttachment: true,
        buttons: [
          {
            text: "NEXT IMAGE",
            id: `${usedPrefix + command}`
          }
        ]
      },
      {
        quoted: m
      }
    )
};

handler.help = ["waifu"].map((a) => a + " *[random image]*");
handler.tags = ["anime"];
handler.command = ["waifu"];

export default handler;