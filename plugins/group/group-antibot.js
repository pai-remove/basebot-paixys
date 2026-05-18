let handler = async (
  m,
  { isAdmin, isOwner, isBotAdmin, conn, args, usedPrefix, command }
) => {
  let chat = global.db.data.chats[m.chat]

  let isClose = {
    on: true,
    off: false,
  }[args[0]]

  // === JIKA ARGUMEN SALAH / TIDAK ADA ===
  if (isClose === undefined) {
    let text = `*[ ${command.toUpperCase()} EXAMPLE ]*
• Example :
${usedPrefix + command} on
${usedPrefix + command} off`

    await conn.sendButtonV2(m.chat, {
      text,
      footer: global.wm2,
      buttons: [
        {
          text: "🟢 TURN ON",
          id: `${usedPrefix + command} on`,
        },
        {
          text: "🔴 TURN OFF",
          id: `${usedPrefix + command} off`,
        },
      ],
    })

    return
  }

  // === TURN OFF ===
  if (isClose === false) {
    chat.antiBot = false
    return m.reply(
      "*[ ✓ ] Successfully turned off anti bot in this group*"
    )
  }

  // === TURN ON ===
  if (isClose === true) {
    chat.antiBot = true
    return m.reply(
      "*[ ✓ ] Successfully turned on anti bot in this group*"
    )
  }
}

handler.help = ["antibot <on/off>"]
handler.tags = ["group"]
handler.command = ["antibot"]
handler.group = true
handler.admin = true
handler.botAdmin = false

export default handler