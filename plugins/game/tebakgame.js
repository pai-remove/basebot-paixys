


let timeout = 120000;
let handler = async (m, { conn, command, usedPrefix }) => {
  conn.tebakgame = conn.tebakgame ? conn.tebakgame : {};
  let id = m.sender;
  if (id in conn.tebakgame) {
    conn.reply(
      m.chat,
      "Masih ada soal belum terjawab di chat ini",
      conn.tebakgame[id].reply,
    );
    throw false;
  }
  let res = await fetch(
    `https://raw.githubusercontent.com/qisyana/scrape/main/tebakgame.json`,
  );
  let src = await res.json();
  let Apps = src[Math.floor(Math.random() * src.length)];
  let json = Apps;
  let caption = `*[ TEBAK GAME ]*
*• Timeout :* 60 seconds
*• Question :* Gambar dari game manakah ini?
*• Clue :*   ${json.jawaban.replace(/[AIUEOaiueo]/gi, "_")}`.trim();
  let q = await conn.sendMessage(
    m.chat,
    {
      image: {
        url: json.img,
      },
      caption: caption,
    },
    {
      quoted: m,
    },
  );
  conn.tebakgame[id] = {
    reply: q,
    ...json,
  };
};
handler.before = async (m, { conn }) => {
  conn.tebakgame = conn.tebakgame ? conn.tebakgame : {};
  let id = m.sender;
  if (m.isCommand) return;
  if (m.command) return;
  if (!conn.tebakgame[id]) return;
  let json = await conn.tebakgame[id];
  let reward = db.data.users[m.sender];
  if (m.text.toLowerCase() === json.jawaban.toLowerCase()) {
    reward.money += parseInt(10000);
    conn.sendImageAsSticker(m.chat, "https://files.catbox.moe/iltcvw.webp", m, {
      packname: "You get reward !",
      author: "+1000 money",
    });
    delete conn.tebakgame[id];
  } else
    conn.sendMessage(m.chat, {
      react: {
        text: "❌",
        key: m.key,
      },
    });
  setTimeout(() => {
    if (conn.tebakgame[id]) {
      conn.reply(
        m.chat,
        `*</> T I M E O U T </>*\n*• Jawaban :* ${json.jawaban}`,
        conn.tebakgame[m.sender].reply,
      );
      delete conn.tebakgame[id];
    }
  }, timeout);
};
handler.help = ["tebakgame"];
handler.tags = ["game"];
handler.command = /^tebakgame/i;
handler.group = false;

export default handler;
