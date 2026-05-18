const quotesBucin = [
  "Kamu tuh kayak kopi, pahit tapi bikin candu.",
  "Aku bukan yang terbaik, tapi aku selalu berusaha jadi yang paling tulus untukmu.",
  "Kalau rindu ini salah, biarkan aku terus salah.",
  "Cintaku sederhana, sesederhana aku yang selalu mikirin kamu.",
  "Kamu tahu nggak? Senyum kamu itu candu yang gak bisa aku berhentiin.",
  "Aku nggak minta kamu sempurna, cukup kamu nggak pergi aja udah bahagia.",
  "Cinta itu kayak hujan, datangnya tiba-tiba, perginya susah ditebak.",
  "Aku gak tahu kenapa, tapi setiap lihat kamu rasanya kayak pulang.",
  "Kamu tuh kayak lagu favorit, gak pernah bosen aku puter tiap hari.",
  "Boleh gak sih aku egois bentar? Aku cuma mau kamu aja.",
  "Kamu emang bukan matahari, tapi sinarmu cukup bikin aku hangat.",
  "Cinta itu bukan tentang seberapa lama kita kenal, tapi seberapa tulus kita bertahan.",
  "Aku gak pandai romantis, tapi aku pandai nunggu kamu balik chat.",
  "Kalau sayang itu dosa, mungkin aku udah masuk neraka karena kamu.",
  "Jangan pergi ya, aku belum siap kehilangan kamu lagi.",
];

// fungsi random
function getRandomBucin() {
  return quotesBucin[Math.floor(Math.random() * quotesBucin.length)];
}

var handler = async (m, { conn }) => {
  const quote = getRandomBucin();
  conn.reply(m.chat, quote, m);
};

handler.help = ["bucin"];
handler.tags = ["quotes"];
handler.command = /^(bucin)$/i;
handler.group = true;

export default handler;