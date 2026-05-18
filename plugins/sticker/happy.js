export default {
  help: ["shappy", "stickerhappy"].map((a) => a + " *[random sticker]*"),
  tags: ["sticker"],
  command: ["shappy", "stickerhappy"],
  limit: true,
  register: true,
  code: async (
    m,
    {
      conn,
      usedPrefix,
      command,
      text,
      isOwner,
      isAdmin,
      isBotAdmin,
      isPrems,
      chatUpdate,
    },
  ) => {
    let data = await Func.fetchJson("https://api.waifu.pics/sfw/happy");
    conn.sendImageAsSticker(m.chat, data.url, m, {
      packname: global.packname,
      author: global.author,
    });
  },
};
