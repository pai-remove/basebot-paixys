let timeout = 120000;
let handler = async (m, { conn, command, usedPrefix }) => {
  conn.tebaklogo = conn.tebaklogo ? conn.tebaklogo : {};
  let id = m.chat;
  if (id in conn.tebaklogo) {
    conn.reply(
      m.chat,
      "Masih ada soal belum terjawab di chat ini",
      conn.tebaklogo[id].reply,
    );
    throw false;
  }
  let res = await fetch(
    `https://raw.githubusercontent.com/orderku/db/main/dbbot/game/tebakapp.json`,
  );
  let src = await res.json();
  let Apps = src[Math.floor(Math.random() * src.length)];
  let json = Apps;
  let caption = `*[ TEBAK LOGO ]*
*• Timeout :* 60 seconds
*• Question :* Logo dari aplikasi/brand apa ini ?
*• Clue :*   ${json.data.jawaban.replace(/[AIUEOaiueo]/gi, "_")}`.trim();
  let q = await conn.sendMessage(
    m.chat,
    { image: { url: json.data.image }, caption: caption },
    { quoted: m },
  );
  conn.tebaklogo[id] = {
    reply: q,
    ...json.data,
  };
  setTimeout(() => {
    if (conn.tebaklogo[id]) {
      conn.reply(
        m.chat,
        `*</> T I M E O U T </>*\n*• Jawaban :* ${json.data.jawaban}`,
        q,
      );
      delete conn.tebaklogo[id];
    }
  }, timeout);
};
handler.before = async (m, { conn }) => {
  conn.tebaklogo = conn.tebaklogo ? conn.tebaklogo : {};
  let id = m.chat;
  if (m.isCommand) return;
  if (!conn.tebaklogo[id]) return;
  let json = await conn.tebaklogo[id];
  let reward = db.data.users[m.sender];
  if (m.text.toLowerCase() === json.jawaban.toLowerCase()) {
    reward.money += parseInt(10000);
    conn.sendImageAsSticker(m.chat, "https://files.catbox.moe/iltcvw.webp", m, {
      packname: "You get reward !",
      author: "+1000 money",
    });
    delete conn.tebaklogo[id];
  } else
    conn.sendImageAsSticker(
      m.chat,
      "https://telegra.ph/file/3c1b009ce6f861bd78e4e.png",
      m,
      {
        packname: "try again !",
        author: "",
      },
    );
};
handler.help = ["tebaklogo"];
handler.tags = ["game"];
handler.command = /^tebaklogo/i;
handler.group = false;

export default handler;
