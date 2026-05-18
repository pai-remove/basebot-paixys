const truthQuestions = [
  "Apa kebohongan terbesar yang pernah kamu katakan?",
  "Siapa orang yang paling kamu rindukan saat ini?",
  "Kalau kamu bisa balikan sama mantan, kamu mau gak?",
  "Apa hal paling memalukan yang pernah kamu lakukan?",
  "Siapa orang yang terakhir kali bikin kamu nangis?",
  "Kalau kamu harus pilih, cinta atau sahabat?",
  "Apa rahasia yang belum pernah kamu ceritain ke siapa pun?",
  "Siapa nama gebetan kamu sekarang?",
  "Kapan terakhir kali kamu bohong sama orang tua?",
  "Apa hal yang paling kamu sesalin dalam hidup?",
  "Kalau kamu bisa ubah satu hal dari dirimu, itu apa?",
  "Siapa orang yang paling kamu pengen peluk sekarang?",
  "Pernah gak suka sama pacar temen sendiri?",
  "Kapan terakhir kali kamu merasa benar-benar bahagia?",
  "Siapa nama mantan yang paling susah kamu lupain?",
  "Pernah jatuh cinta sama orang yang gak mungkin kamu miliki?",
  "Apa hal paling gila yang pernah kamu lakukan demi cinta?",
  "Kalau kamu jadi lawan jenis sehari, hal pertama yang kamu lakukan apa?",
  "Pernah kepoin mantan diam-diam?",
  "Apa ketakutan terbesar kamu dalam hidup?",
];

// Fungsi untuk ambil pertanyaan acak
function getRandomTruth() {
  return truthQuestions[Math.floor(Math.random() * truthQuestions.length)];
}

let handler = async (m, { conn }) => {
  const question = getRandomTruth();
  conn.reply(m.chat, `🫣 *Truth Challenge!*\n\n${question}`, m);
};

handler.help = ["truth"];
handler.tags = ["quotes", "fun"];
handler.command = /^(truth)$/i;
handler.group = true;

export default handler;