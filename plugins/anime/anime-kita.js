/*
 * Belum kelar :v, kalo mau lanjutin silahkan
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
  conn.anime = conn.anime ? conn.anime : {};
  if (!text)
    throw `*[ ANIME EXAMPLE ]*
> *• Example :* ${usedPrefix + command} search *[title anime]*
> *• Example :* ${usedPrefix + command} detail *[slug_id]*
> *• Example :* ${usedPrefix + command} stream *[slug_id]*
> *• Example :* ${usedPrefix + command} latest`;
  const keyword = text.split(" ")[0];
  const data = text.slice(keyword.length + 1);
  if (keyword === "search") {
    if (!data)
      throw `*• Example :* ${usedPrefix + command} search *[title anime]*`;
    let a = await Func.fetchJson(
      "https://api.apigratis.site/anime/search?query=" + data,
    );
    let json = a.result.results;
    let cap = `*[ ANIME SEARCH ]*
${json
  .map(
    (a) => `*• Title :* ${a.title}
*• slug :* ${a.slug}
*• Episode :* ${a.episode}
*• Cover :* ${a.cover}`,
  )
  .join("\n\n")}`;
    let array = json.map((i, a) => ({
      rows: [
        {
          title: `${a + 1}.` + " Get detail Anime",
          body: "• Title : " + i.title,
          command: ".anime detail " + i.slug,
        },
      ],
    }));

    return conn.sendList(m.chat, "Detail Anime", array, fkontak, {
      body: cap,
      url: json[0].cover,
    });
    conn.anime[m.sender] = json;
  }
};
handler.help = ["anime"].map((a) => a + " *[animekita info]*");
handler.tags = ["anime"];
handler.command = ["anime"];

export default handler;
