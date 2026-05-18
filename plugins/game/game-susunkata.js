import fetch from "node-fetch";

let timeout = 120000;

let handler = async (m, { conn, command }) => {
  conn.susunkata = conn.susunkata ? conn.susunkata : {};
  let id = m.sender;

  if (id in conn.susunkata) {
    conn.reply(m.chat, "*Masih ada soal belum terjawab di chat ini*", conn.susunkata[id].reply);
    throw false;
  }

  // Ambil soal dari API lolhuman
  let res = await fetch(`https://api.lolhuman.xyz/api/game/susunkata?apikey=${global.lolhuman}`);
  let json = await res.json();

  if (!json || json.status !== 200) throw "Gagal mengambil data dari API!";
  let data = json.result;

  let caption = `*[ SUSUN KATA ]*
*• Timeout :* 60 seconds
*• Question :* ${data.pertanyaan}
*• Clue :* ${data.tipe || "Tidak ada"}\n
*• Hint :* ${data.jawaban.replace(/[AIUEOaiueo]/g, "_")}`.trim();

  let q = await conn.reply(m.chat, caption, m);
  conn.susunkata[id] = {
    reply: q,
    jawaban: data.jawaban,
  };

  // Timeout
  setTimeout(() => {
    if (conn.susunkata[id]) {
      conn.reply(m.chat, `*</> T I M E O U T </>*\n*• Jawaban :* ${data.jawaban}`, q);
      delete conn.susunkata[id];
    }
  }, timeout);
};

handler.before = async (m, { conn }) => {
  conn.susunkata = conn.susunkata ? conn.susunkata : {};
  let id = m.sender;

  if (!m.text || m.isCommand || !conn.susunkata[id]) return;

  let json = conn.susunkata[id];
  let reward = db.data.users[m.sender];

  if (m.text.toLowerCase() === json.jawaban.toLowerCase()) {
    reward.money += 10000;
    conn.sendImageAsSticker(m.chat, "https://files.catbox.moe/iltcvw.webp", m, {
      packname: "You get reward !",
      author: "+10000 money",
    });
    delete conn.susunkata[id];
  } else {
    conn.sendMessage(m.chat, {
      react: { text: "❌", key: m.key },
    });
  }
};

handler.help = ["susunkata"];
handler.tags = ["game"];
handler.command = ["susunkata"];
handler.group = true;

export default handler;