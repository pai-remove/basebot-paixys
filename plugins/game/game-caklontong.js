import fetch from "node-fetch";

let timeout = 120000;

let handler = async (m, { conn }) => {
  conn.caklontong = conn.caklontong || {};
  let id = m.chat;
  if (id in conn.caklontong) {
    return conn.reply(
      m.chat,
      "Masih ada soal belum terjawab di chat ini!",
      conn.caklontong[id].reply
    );
  }

  let res = await fetch(`https://api.lolhuman.xyz/api/tebak/caklontong?apikey=${global.lolhuman}`);
  let data = await res.json();

  if (!data || !data.result)
    throw "Gagal mengambil soal, coba lagi nanti.";

  let soal = data.result.question || data.result.soal;
  let jawaban = data.result.answer || data.result.jawaban;

  let caption = `*[ CAK LONTONG ]*
*• Timeout:* 60 seconds
*• Question:* ${soal}
*• Clue:* ${jawaban.replace(/[AIUEOaiueo]/g, "_")}`.trim();

  let q = await conn.reply(m.chat, caption, m);
  conn.caklontong[id] = { reply: q, jawaban };

  setTimeout(() => {
    if (conn.caklontong[id]) {
      conn.reply(
        m.chat,
        `*</> T I M E O U T </>*\n*• Jawaban:* ${jawaban}`,
        q
      );
      delete conn.caklontong[id];
    }
  }, timeout);
};

handler.before = async (m, { conn }) => {
  conn.caklontong = conn.caklontong || {};
  let id = m.chat;
  if (!m.text || m.isCommand) return;
  if (!conn.caklontong[id]) return;

  let json = conn.caklontong[id];
  let reward = db.data.users[m.sender];

  if (m.text.toLowerCase() === json.jawaban.toLowerCase()) {
    reward.money += 10000;
    await conn.sendImageAsSticker(
      m.chat,
      "https://files.catbox.moe/iltcvw.webp",
      m,
      {
        packname: "You get reward!",
        author: "+10000 money",
      }
    );
    delete conn.caklontong[id];
  } else {
    conn.sendMessage(m.chat, {
      react: { text: "❌", key: m.key },
    });
  }
};

handler.help = ["caklontong"];
handler.tags = ["game"];
handler.command = ["caklontong"];
handler.group = false;

export default handler;