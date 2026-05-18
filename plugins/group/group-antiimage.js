let handler = async (
  m,
  { isAdmin, isOwner, isBotAdmin, conn, args, usedPrefix, command }
) => {
  let chat = global.db.data.chats[m.chat]

  let isClose = {
    on: true,
    off: false,
  }[args[0]]

  // === JIKA ARGUMEN SALAH / KOSONG ===
  if (isClose === undefined) {
    let text = `*[ ${command.toUpperCase()} EXAMPLE ]*
• Example :
${usedPrefix + command} on
${usedPrefix + command} off`

    await conn.sendButtonV2(m.chat, {
      text,
      footer: wm2,
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

  // === SETTING VALUE ===
  chat.antiFoto = isClose

  let responseMessage = isClose
    ? "*[ ✓ ] Successfully turned ON anti image in this group*"
    : "*[ ✓ ] Successfully turned OFF anti image in this group*"

  await conn.sendButtonV2(m.chat, {
    text: responseMessage,
    footer: wm2,
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
}

handler.help = ["antiimage <on/off>"]
handler.tags = ["group"]
handler.command = ["antiimage"]
handler.group = true
handler.admin = true
handler.botAdmin = false

export default handler