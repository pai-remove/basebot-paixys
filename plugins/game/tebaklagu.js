let timeout = 120000;
let handler = async (m, { conn, command, usedPrefix }) => {
  conn.tebaklagu = conn.tebaklagu ? conn.tebaklagu : {};
  let id = m.sender;
  if (id in conn.tebaklagu) {
    conn.reply(
      m.chat,
      "Masih ada soal belum terjawab di chat ini",
      conn.tebaklagu[id].reply,
    );
    throw false;
  }
  let res = await fetch(
    `https://raw.githubusercontent.com/qisyana/scrape/main/tebaklagu.json`,
  );
  let src = await res.json();
  let Apps = src[Math.floor(Math.random() * src.length)];
  let json = Apps;
  let caption = `*[ TEBAK LAGU ]*
*• Timeout :* 60 seconds
*• Question :* Tebak judul lagu dari artis ${json.artis} ?
*• Clue :* ${json.judul.replace(/[AIUEOaiueo]/gi, "_")}`.trim();
  let q = await conn.reply(m.chat, caption, m);
  conn.tebaklagu[id] = {
    reply: q,
    ...json,
  };
  await conn.sendFile(m.chat, json.lagu, null, null, m);
};
handler.before = async (m, { conn }) => {
  conn.tebaklagu = conn.tebaklagu ? conn.tebaklagu : {};
  let id = m.sender;
  if (m.isCommand) return;
  if (!conn.tebaklagu[id]) return;
  let json = await conn.tebaklagu[id];
  let reward = db.data.users[m.sender];
  if (m.text.toLowerCase() === json.judul.toLowerCase()) {
    reward.money += parseInt(10000);
    conn.sendImageAsSticker(m.chat, "https://files.catbox.moe/iltcvw.webp", m, {
      packname: "You get reward !",
      author: "+1000 money",
    });
    delete conn.tebaklagu[id];
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
  if (conn.tebaklagu[id]) {
    setTimeout(() => {
      conn.reply(
        m.chat,
        `*</> T I M E O U T </>*\n*• Jawaban :* ${json.judul}`,
        json.reply,
      );
      delete conn.tebaklagu[id];
    }, timeout);
  }
};
handler.help = ["tebaklagu"];
handler.tags = ["game"];
handler.command = /^tebaklagu/i;
handler.group = true;

export default handler;
