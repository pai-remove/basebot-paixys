


export default {
  help: ["genshin-sheets"].map((a) => a + " *[name chara]*"),
  tags: ["anime"],
  command: ["genshin-sheets"],
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
    const characters = {
      albedo: "Albedo_Sub DPS",
      alhaitham: "Alhaitham_Main DPS",
      aloy: "Aloy_Support",
      amber: "Amber_Support",
      arataki: "Arataki Itto_Main DPS",
      baizhu: "Baizhu_Healer",
      barbara: "Barbara_Healer",
      beidou: "Beidou_Burst DPS",
      bennet: "Bennet_Support",
      candace: "Candace_Support",
      charlotte: "Charlotte_Healer",
      chevreuse: "Chevreuse_Support",
      chongyun: "Chongyun_Sub DPS",
      collei: "Collei_Support",
      cyno: "Cyno_Aggravate",
      dehya: "Dehya_Burgeon",
      diluc: "Diluc_Main DPS",
      diona: "Diona_Shielder",
      dori: "Dori_Support",
      eula: "Eula_Main DPS",
      faruzan: "Faruzan_Support",
      fischl: "Fischl_Sub DPS",
      freminet: "Freminet_Main DPS",
      furina: "Furina_Sub DPS",
      gaming: "Gaming_Main DPS",
      ganyu: "Ganyu_Main DPS",
      hutao: "Hu Tao_Main DPS",
      jean: "Jean_Support",
      kaedehara: "Kaedehara Kazuha_Support",
      kaeya: "Kaeya_Sub DPS",
      kaveh: "Kaveh_Driver",
      keqing: "Keqing_Main DPS",
      klee: "Klee_Main DPS",
      nahida: "Nahida_Support",
      raiden: "Raiden Shogun_Burst DPS",
      yaemiko: "Yae Miko_Sub DPS",
      yanfei: "Yanfei_Main DPS",
      yaoyao: "Yaoyao_Healer",
      yelan: "Yelan_Burst DPS",
      zhongli: "Zhongli_Burst DPS",
    };
    if (!text)
      return m.reply(`*• Example :* ${usedPrefix + command} *[chara name]*

*• List Characters :*
- ${Object.keys(characters).join("\n- ")}`);
    let Maximus = characters[text.toLowerCase()];
    if (Maximus) {
      let data = await fetch(
        `https://raw.githubusercontent.com/FortOfFans/GI/main/sheets/${Maximus}.jpg`,
      );
      if (!data.ok) throw new Error("Gagal mendapatkan data gambar");
      let image = await data.buffer();
      conn.sendFile(m.chat, image, null, `Genshin Impact - Sheet`, m);
    } else {
      return m.reply(`*• Example :* ${usedPrefix + command} *[chara name]*
*• List Characters :*
${Object.keys(characters).join("\n- ")}`);
    }
  },
};
