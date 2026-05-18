let handler = async (
  m,
  { isAdmin, isOwner, isBotAdmin, conn, args, usedPrefix, command }
) => {
  let isClose = {
    open: "not_announcement",
    buka: "not_announcement",
    on: "not_announcement",
    1: "not_announcement",

    close: "announcement",
    tutup: "announcement",
    off: "announcement",
    0: "announcement",
  }[args[0]]

  // === JIKA ARGUMEN KOSONG / SALAH ===
  if (isClose === undefined) {
    let text = `*[ GROUP SETTING EXAMPLE ]*
• Example :
${usedPrefix + command} open
${usedPrefix + command} close`

    await conn.sendButtonV2(m.chat, {
      text,
      footer: global.wm2,
      buttons: [
        {
          text: "🟢 OPEN GROUP",
          id: `${usedPrefix + command} open`,
        },
        {
          text: "🔴 CLOSE GROUP",
          id: `${usedPrefix + command} close`,
        },
      ],
    })
    return
  }

  // === UPDATE SETTING GROUP ===
  await conn.groupSettingUpdate(m.chat, isClose)

  let response =
    isClose === "announcement"
      ? "✅ Grup berhasil *DITUTUP*"
      : "✅ Grup berhasil *DIBUKA*"

  await conn.sendButtonV2(m.chat, {
    text: response,
    footer: global.wm2,
    buttons: [
      {
        text: "🟢 OPEN GROUP",
        id: `${usedPrefix + command} open`,
      },
      {
        text: "🔴 CLOSE GROUP",
        id: `${usedPrefix + command} close`,
      },
    ],
  })
}

handler.help = ["group", "gc", "grup"].map(v => v + " <open/close>")
handler.tags = ["group"]
handler.command = ["group", "gc", "grup"]
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler