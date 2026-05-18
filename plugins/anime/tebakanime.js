let timeout = 120000;
let handler = async (m, { conn, command, usedPrefix }) => {
  conn.tebakanime = conn.tebakanime ? conn.tebakanime : {};
  let id = m.chat;
  if (id in conn.tebakanime) {
    conn.reply(
      m.chat,
      "Masih ada soal belum terjawab di chat ini",
      conn.tebakanime[id].reply,
    );
    throw false;
  }
  let src = await tebakanime();
  let Apps = src[Math.floor(Math.random() * src.length)];
  let json = Apps;
  let caption = `*[ TEBAK ANIME ]*
*• Timeout :* 60 seconds
*• Question :* Gambar dari anime apakah ini?
*• Clue :*   ${json.title.replace(/[AIUEOaiueo]/gi, "_")}`.trim();
  let q = await conn.sendMessage(
    m.chat,
    { image: { url: json.img }, caption: caption },
    { quoted: m },
  );
  conn.tebakanime[id] = {
    reply: q,
    ...json,
  };
};
handler.before = async (m, { conn }) => {
  conn.tebakanime = conn.tebakanime ? conn.tebakanime : {};
  let id = m.chat;
  if (m.isCommand) return;
  if (!conn.tebakanime[id]) return;
  let json = await conn.tebakanime[id];
  let reward = db.data.users[m.sender];
  if (m.text.toLowerCase() === json.title.toLowerCase()) {
    reward.money += parseInt(10000);
    conn.sendImageAsSticker(m.chat, "https://files.catbox.moe/iltcvw.webp", m, {
      packname: "You get reward !",
      author: "+1000 money",
    });
    delete conn.tebakanime[id];
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
  setTimeout(() => {
    if (conn.tebakanime[id]) {
      conn.reply(
        m.chat,
        `*</> T I M E O U T </>*\n*• Jawaban :* ${json.title}`,
        conn.tebakanime[id].reply,
      );
      delete conn.tebakanime[id];
    }
  }, timeout);
};
handler.help = ["tebakanime"];
handler.tags = ["game"];
handler.command = /^tebakanime/i;
handler.group = false;

export default handler;

/*
 * Create by Syaii
 * Kurang banyak ?, request judul anime kesini:
 * wa.me/6287869975929
 */
async function tebakanime() {
  return [
    { img: "https://files.catbox.moe/lwq1y4.jpg", title: "Oshi no Ko" },
    { img: "https://files.catbox.moe/8dliwy.jpg", title: "Yuru Camp" },
    { img: "https://files.catbox.moe/4c0g6c.jpg", title: "Bocchi the Rock" },
    { img: "https://files.catbox.moe/wrmo4u.jpg", title: "Wind Breaker" },
    { img: "https://files.catbox.moe/uahk3t.jpg", title: "Dungeon Meshi" },
    { img: "https://files.catbox.moe/h45rma.png", title: "Kaiju no 8" },
    { img: "https://files.catbox.moe/qld4dh.jpg", title: "Kannagi" },
    { img: "https://files.catbox.moe/qcigk2.jpg", title: "Shangi-La Frontier" },
    { img: "https://files.catbox.moe/g4l0wn.jpg", title: "Solo Leveling" },
    { img: "https://files.catbox.moe/mup2x5.jpg", title: "Ragna Crimson" },
    { img: "https://files.catbox.moe/4gk1f7.png", title: "Mashle" },
    {
      img: "https://files.catbox.moe/kjisyh.jpg",
      title: "Isekai Nonbiri Nouka",
    },
    {
      img: "https://files.catbox.moe/6adv3x.jpg",
      title: "Classroom of the Elite",
    },
    {
      img: "https://files.catbox.moe/boh0z0.jpg",
      title: "Kusuriya no Hitorigoto",
    },
    { img: "https://files.catbox.moe/zeufc4.jpg", title: "Sosou no Frieren" },
    { img: "https://files.catbox.moe/1dm2sk.jpg", title: "Mushoku Tensei" },
  ];
}
