
const timeout = 60000; // 60 detik

// Data lokal — bisa ditambah
const dataKimia = [
  { lambang: "H", unsur: "Hidrogen" },
  { lambang: "O", unsur: "Oksigen" },
  { lambang: "Na", unsur: "Natrium" },
  { lambang: "Fe", unsur: "Besi" },
  { lambang: "Au", unsur: "Emas" },
  { lambang: "Ag", unsur: "Perak" },
  { lambang: "Cu", unsur: "Tembaga" },
  { lambang: "He", unsur: "Helium" },
  { lambang: "C", unsur: "Karbon" },
  { lambang: "N", unsur: "Nitrogen" },
];

// Fungsi ambil random data
function getRandomKimia() {
  return dataKimia[Math.floor(Math.random() * dataKimia.length)];
}

let handler = async (m, { conn }) => {
  conn.tebakkimia = conn.tebakkimia || {};
  const id = m.chat;

  if (id in conn.tebakkimia)
    return conn.reply(m.chat, "Masih ada soal belum terjawab di chat ini.", conn.tebakkimia[id].reply);

  const json = getRandomKimia();
  const caption = `*[ TEBAK KIMIA ]*
*• Timeout:* 60 detik
*• Simbol:* ${json.lambang}
*• Clue:* ${json.unsur.replace(/[AIUEOaiueo]/g, "_")}
`.trim();

  const q = await conn.reply(m.chat, caption, m);
  conn.tebakkimia[id] = { reply: q, ...json };

  setTimeout(() => {
    if (conn.tebakkimia[id]) {
      conn.reply(m.chat, `*</> T I M E O U T </>*\n*• Jawaban:* ${json.unsur}`, q);
      delete conn.tebakkimia[id];
    }
  }, timeout);
};

handler.before = async (m, { conn }) => {
  conn.tebakkimia = conn.tebakkimia || {};
  const id = m.chat;
  if (!m.text || m.isCommand || !conn.tebakkimia[id]) return;

  const json = conn.tebakkimia[id];
  const reward = db.data.users[m.sender] || (db.data.users[m.sender] = { money: 0 });

  if (m.text.toLowerCase() === json.unsur.toLowerCase()) {
    reward.money += 10000;
    await conn.sendImageAsSticker(m.chat, "https://files.catbox.moe/iltcvw.webp", m, {
      packname: "You get reward!",
      author: "+10000 money",
    });
    delete conn.tebakkimia[id];
  } else {
    await conn.sendImageAsSticker(m.chat, "https://telegra.ph/file/3c1b009ce6f861bd78e4e.png", m, {
      packname: "Try again!",
      author: "",
    });
  }
};

handler.help = ["tebakkimia"];
handler.tags = ["game"];
handler.command = ["tebakkimia"];
handler.group = false;

export default handler;