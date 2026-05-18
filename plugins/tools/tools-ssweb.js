


export default {
  help: ["ssweb"].map((a) => a + " *[url]*"),
  tags: ["tools"],
  command: ["ssweb"],
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
    if (!text) throw `*• Example :* ${usedPrefix + command} *[url]*`;
    m.reply(wait);
    conn.sendMessage(m.chat, {
      image: {
        url: `https://api.mightyshare.io/v1/19EIFDUEL496RA3F/jpg?url=${Func.isUrl(text) ? text : `https://${text}`}`,
      },
      caption: done,
    });
  },
};
