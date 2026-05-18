export default {
  help: ["setbye"].map((a) => a + " *[Input text]*"),
  tags: ["group"],
  command: ["setbye"],
  group: true,
  admin: true,
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
    if (!text)
      throw `*• Example :* ${usedPrefix + command} *[input text]*

*• Guide :*
* *@user* : tag nomor member
* *@subject* : nama group
* *desc* : deskripsi group 

"Selamat Tinggal @user ! semoga kamu cepat kembali !"`;
    let chat = db.data.chats[m.chat];
    chat.leave = text;
    m.reply("Success Change text Goodbye ✓");
  },
};
