let handler = async (m, { conn, text, usedPrefix, command }) => {
  let chara = (
    await Func.fetchJson("https://api.ennead.cc/buruaka/character")
  ).map((a) => a.name);
  if (!text)
    throw `*• Example :* ${usedPrefix + command} *[character name]*

*List Characters in database :*
${chara.map((a) => "• " + a).join("\n")}`;
  let capital = (txt) => {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
  };
  if (!chara.includes(capital(text)))
    throw `*• Example :* ${usedPrefix + command} *[character name]*

*List Characters in database :*
${chara.map((a) => "• " + a).join("\n")}`;
  m.reply(wait);
  let a = await Func.fetchJson(
    "https://api.ennead.cc/buruaka/character/" + capital(text),
  );
  if (a.StatusCode) {
    m.reply("*[ CHARACTER NOT FOUND ]*");
  } else {
    let cap = `*[ BLUE ARCHIVE INFORMATION ]*
*• Name :* ${a.character.name}
*• Age :* ${a.info.age}
*• Height :* ${a.info.height}
*• School :* ${a.info.school}
*• Year :* ${a.info.schoolYear}
*• Club :* ${a.info.club}
*• Birth Date :* ${a.info.birthDate}

*• Base Star :* ${a.character.baseStar}
*• Rank :* ${a.character.rarity}
*• Role :* ${a.character.role}
*• Type :*
* Squad : ${a.character.squadType}
* Weapon : ${a.character.weaponType}
* Bullet : ${a.character.bulletType}
* Armor : ${a.character.armorType}`;
    m.reply(cap, a.image.portrait);
  }
};
handler.help = ["ba", "bluearchive", "blue-archive"].map(
  (a) => a + " *[character name]*",
);
handler.tags = ["anime"];
handler.command = ["ba", "bluearchive", "blue-archive"];

export default handler;
