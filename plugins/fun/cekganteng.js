let handler = async (m) => {
    const percentage = Math.floor(Math.random() * 100) + 1;
    const komentar = percentage > 80 ? '🔥 Wah, Kakak ini benar-benar bikin meleleh!' : 
                    percentage > 50 ? '😎 Lumayan ganteng sih, Kak!' :
                    '😅 Hmm... yang penting percaya diri ya, Kak!';

    m.reply(`👑 *Cek Ganteng*\n\nKegantengan Kakak ada di angka *${percentage}%*\n${komentar}`);
};

handler.command = /^cekganteng$/i;
handler.tags = ['fun'];
handler.help = ['cekganteng'];

export default handler;