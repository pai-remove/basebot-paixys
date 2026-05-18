let handler = async (m) => {
    const kepribadian = [
        '🧠 Cerdas dan bijaksana.',
        '❤️ Penuh kasih sayang dan perhatian.',
        '🔥 Bersemangat dan penuh energi.',
        '🎭 Misterius dan sulit ditebak.',
        '😄 Ramah dan menyenangkan.',
        '😎 Cool dan tenang dalam segala situasi.',
        '😅 Sering baperan, tapi baik hati.'
    ];
    const randomKepribadian = kepribadian[Math.floor(Math.random() * kepribadian.length)];
    m.reply(`🪄 *Cek Kepribadian*\n\nKakak memiliki kepribadian:\n${randomKepribadian}`);
};

handler.command = /^cekkpribadian$/i;
handler.tags = ['fun'];
handler.help = ['cekkpribadian'];

export default handler;