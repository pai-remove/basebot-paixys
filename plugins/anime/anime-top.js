export default {
  help: ["topanime"].map((a) => a + " *[get top anime]*"),
  tags: ["anime"],
  command: ["topanime"],
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
    let data = await (
      await Func.fetchJson(
        "https://cors-flame.vercel.app/api/cors?url=https://api.jikan.moe/v4/top/anime",
      )
    ).data;
    let arr = [];
    let rank = 0;
    for (let a of data) {
      rank++;
      arr.push([
        `*[ RANKING ${rank} ]*
*• Title :* ${a.title}
*• Genre :* *[ ${a.genres.map((a) => a.name).join(", ")} ]*
*• Type :* ${a.type}
*• Season :* ${a.season} *[ ${a.year} ]*
*• Source :* ${a.source}
*• Total episode :* ${a.episodes}
*• Status :* ${a.status}
*• Duration :* ${a.duration}
*• Studio :* *[ ${a.studios.map((a) => a.name).join(", ")} ]*
*• Rating :* ${a.rating}
*• Score :* ${a.score}/10.0
*• Popularity :* ${a.popularity}`,
        "",
        a.images["jpg"].large_image_url,
        [],
        null,
        [["Watch Trailer !", a.trailer.url]],
      ]);
    }
    conn.sendCarousel(m.chat, arr, m, {
      body: `*+ T O P - A N I M E*

List Anime dengan rating tertinggi saat ini !`,
    });
  },
};
