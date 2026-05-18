const dareChallenges = [
  "Kirim voice note bilang 'aku sayang kamu' ke orang random di grup.",
  "Ubah nama kamu di grup jadi 'Aku Lucu Banget 😝' selama 5 menit.",
  "Kirim pesan ke mantan (kalau ada) bilang kamu kangen 😳",
  "Foto duckface dan kirim ke grup sekarang!",
  "Nyanyi 1 bait lagu favorit kamu lewat VN.",
  "Ketik 'aku lagi jatuh cinta sama seseorang di sini' tanpa konteks.",
  "Spam emoji ❤️ sebanyak 10 kali di grup.",
  "Ganti bio WhatsApp kamu jadi 'aku butuh perhatian 😭' selama 10 menit.",
  "Kirim foto tangan kamu ke grup.",
  "Kirim pesan ke kontak terakhir kamu bilang 'aku mimpiin kamu tadi malam 🥺'.",
  "Ketik huruf 'A' di setiap pesan yang dikirim orang lain selama 2 menit.",
  "Kirim stiker paling cringe yang kamu punya.",
  "Tulis 'aku naksir sama kamu' ke orang yang paling aktif di grup.",
  "Ngaku dosa kecil yang baru kamu lakukan minggu ini 😆",
  "Ketik 'aku imut banget sih' di grup tanpa konteks.",
  "Pura-pura marah ke seseorang di grup selama 3 menit.",
  "Kirim selfie sambil senyum paling manis 🥰",
  "Ketik pesan pakai CAPS LOCK terus selama 5 menit.",
  "Ketik pesan cuma pake emoji selama 1 menit.",
  "Kirim pesan ke admin bilang 'aku mau confess sesuatu penting'.",
];

function getRandomDare() {
  return dareChallenges[Math.floor(Math.random() * dareChallenges.length)];
}

let handler = async (m, { conn }) => {
  const challenge = getRandomDare();
  conn.reply(m.chat, `😈 *Dare Challenge!*\n\n${challenge}`, m);
};

handler.help = ["dare"];
handler.tags = ["quotes", "fun"];
handler.command = /^(dare)$/i;
handler.group = true;

export default handler;