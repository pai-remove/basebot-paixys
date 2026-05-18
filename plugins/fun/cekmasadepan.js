let handler = async (m) => {
    const masaDepan = [
        '💼 Akan jadi bos besar di perusahaan ternama!',
        '🏝️ Pensiun muda dan tinggal di pulau tropis.',
        '💖 Akan menemukan cinta sejati dalam waktu dekat.',
        '📚 Akan jadi orang yang sangat berilmu dan dihormati.',
        '💸 Kaya raya dengan bisnis sukses!',
        '🎭 Masa depan Kakak penuh misteri dan kejutan!',
        '😴 Hmm... masa depan Kakak masih kabur, coba lagi nanti.'
    ];
    const randomMasaDepan = masaDepan[Math.floor(Math.random() * masaDepan.length)];
    m.reply(`🔮 *Cek Masa Depan*\n\nRamalan masa depan Kakak:\n${randomMasaDepan}`);
};

handler.command = /^cekmasadepan$/i;
handler.tags = ['fun'];
handler.help = ['cekmasadepan'];

export default handler;