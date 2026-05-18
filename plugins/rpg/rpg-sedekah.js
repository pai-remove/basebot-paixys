const handler = async (m, { conn, args }) => {
    let user = global.db.data.users[m.sender];

    if (!args[0] || isNaN(args[0])) return m.reply('Masukkan jumlah sedekah! Contoh: *!sedekah 10000*');

    let amount = parseInt(args[0]);

    if (amount <= 0) return m.reply('Jumlah sedekah tidak valid!');
    if (user.money < amount) return m.reply('Uang kamu tidak cukup untuk sedekah!');

    user.money -= amount;
    user.exp += amount / 2;

    let message = `
🤲 *Sedekah Berhasil!*
📌 Nama: ${conn.getName(m.sender)}
💰 Jumlah: Rp${amount.toLocaleString()}
✨ Pahala (EXP): +${(amount / 2).toLocaleString()}

"Barang siapa bersedekah di bulan Ramadhan, maka pahalanya akan dilipatgandakan." 🕌
    `.trim();

    conn.reply(m.chat, message, m);
};

handler.help = ['sedekah <jumlah>'];
handler.tags = ['ramadhan', 'rpg'];
handler.command = /^sedekah$/i;
handler.group = true;
handler.premium = false;

export default handler;