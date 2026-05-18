let handler = async (m, { conn, command }) => {
  if (!m.isGroup) throw "Perintah ini hanya untuk grup!"

  const ownerGroup = m.chat.split("-")[0] + "@s.whatsapp.net"

  let target =
    m.mentionedJid?.[0] ||
    m.quoted?.sender

  if (!target) {
    throw `*• Example :* .${command} *[reply / tag user]*`
  }

  // proteksi owner & bot
  if (
    target === ownerGroup ||
    target === conn.user.jid
  ) {
    throw "Tidak bisa memproses owner grup atau bot!"
  }

  let action = command === "promote" ? "promote" : "demote"

  await conn.groupParticipantsUpdate(
    m.chat,
    [target],
    action
  )

  let teks =
    action === "promote"
      ? `*[  ✓  ] @${target.split("@")[0]}* successfully promoted to *Admin*`
      : `*[  ✓  ] @${target.split("@")[0]}* successfully removed from *Admin*`

  await conn.sendMessage(
  m.chat,
  {
    text: teks,
    mentions: [target]
  },
  { quoted: m }
)
}

handler.help = ["promote", "demote"].map(
  v => v + " *[reply/tag user]*"
)
handler.tags = ["group"]
handler.command = ["promote", "demote"]
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler