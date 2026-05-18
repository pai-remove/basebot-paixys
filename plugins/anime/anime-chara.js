let handler = async (m, { conn, text, usedPrefix, command }) => {
  conn.chara = conn.chara || {}

  if (!text) {
    throw `*• Example :* ${usedPrefix + command} *[name chara]*`
  }

  let key = text.split(" ")[0]
  let data = text.slice(key.length + 1)

  try {
    // ===== DETAIL MODE =====
    if (key === "detail" && conn.chara[m.sender]) {
      if (isNaN(data)) return

      let detail = conn.chara[m.sender].data[data - 1]
      if (!detail) throw "Data tidak ditemukan"

      let cap = `*[ CHARA INFO ${detail.name} ]*
*• Name :* ${detail.name} [ ${detail.name_kanji || "-"} ]
*• Mal ID :* ${detail.mal_id}
*• Url :* ${detail.url}
*• Total Favorites :* ${Func.formatNumber(detail.favorites)}

\`\`\`${detail.about || "No description"}\`\`\``

      await conn.sendButtonV2(
        m.chat,
        {
          caption: cap,
          footer: global.wm2,
          image: { url: detail.images.jpg.image_url },
          buttons: [
            {
              text: "BACK TO MENU",
              id: `.menu`
            }
          ]
        },
        { quoted: m }
      )

      delete conn.chara[m.sender]
    }

    // ===== SEARCH MODE =====
    else {
      let list = await Func.fetchJson(
        "https://api.jikan.moe/v4/characters?page=1&q=" + encodeURIComponent(text)
      )

      if (!list.data || !list.data.length) {
        throw "Character tidak ditemukan"
      }

      const buttons = list.data.map((i, a) => ({
        text: `${i.name} • Fav: ${i.favorites}`,
        id: `${usedPrefix + command} detail ${a + 1}`
      }))

      await conn.sendButtonV2(
        m.chat,
        {
          caption: `*[ SEARCH CHARA ]*
*• Keyword :* ${text}
*• Total Characters :* ${list.data.length}`,
          footer: global.wm2,
          image: { url: list.data[0].images.jpg.image_url },
          buttons
        },
        { quoted: m }
      )

      conn.chara[m.sender] = list
    }
  } catch (e) {
    throw e
  }
}

handler.help = ["chara"].map(a => a + " *[name chara]*")
handler.tags = ["anime"]
handler.command = ["chara"]

export default handler