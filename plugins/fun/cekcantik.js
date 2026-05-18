let handler = async (m) => {
    const percentage = Math.floor(Math.random() * 100) + 1;
    const komentar = percentage > 80 ? '🔥 Wah, Kakak ini benar-benar bikin meleleh!' : 
                    percentage > 50 ? '😍 Lumayan cantik sih, Kak!' :
                    '😅 Hmm... yang penting percaya diri ya, Kak!';

    m.reply(`👑 *Cek Cantik*\n\nKecantikan Kakak ada di angka *${percentage}%*\n${komentar}`);
};

handler.command = /^cekcantik$/i;
handler.tags = ['fun'];
handler.help = ['cekcantik'];

export default handler;