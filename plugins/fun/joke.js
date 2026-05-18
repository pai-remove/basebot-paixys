let handler = async (m) => {
    const jokes = [
        '🤣 Kenapa kucing gak suka online? Karena takut kena mouse!',
        '🤣 Apa bahasa Jepangnya diskon? Murah-murashii!',
        '🤣 Kenapa sepeda gak bisa berdiri sendiri? Karena lelah!',
        '🤣 Kenapa ikan gak pernah ketabrak saat berenang? Karena selalu lihat ke kiri dan kanan!',
        '🤣 Hewan apa yang gak pernah salah? Kuda, karena selalu di jalur yang benar!',
        '🤣 Kenapa matematika bikin pusing? Karena kalau dihitung terus, gak ada habisnya!',
        '🤣 Apa bedanya jemuran sama orang ngambek? Kalau jemuran dijemur, kalau orang ngambek diem-diem aja!',
        '🤣 Kenapa pohon kelapa di depan rumah harus ditebang? Soalnya kalau dicabut berat!',
        '🤣 Ayam apa yang bikin lelah? Ayam capek (cape)!',
        '🤣 Kalau ikan jadi presiden, siapa wakilnya? Ikan Hiu… Hiupresiden!',
        '🤣 Kenapa komputer suka kerja lembur? Soalnya takut di-*shutdown*!',
        '🤣 Apa bahasa Jepangnya air terjun? Byur-byur-yamashita!',
        '🤣 Kenapa guru selalu bawa buku? Karena kalau bawa genteng berat!',
        '🤣 Hewan apa yang paling kaya? Beruang... Karena punya *bear*-ang!',
        '🤣 Kenapa burung gagak gak pernah ke gym? Karena udah punya *sayap*!',
        '🤣 Kenapa tikus suka ke bioskop? Karena di sana banyak *trail*r (tikus rela)!',
        '🤣 Apa yang lebih kecil dari semut? Bayinya semut!',
        '🤣 Kenapa Superman gak pernah pake baju warna hijau? Karena warnanya udah dipake Hulk!',
        '🤣 Kenapa lampu merah suka bikin macet? Soalnya dia suka berhenti di tempat!',
        '🤣 Kenapa nasi goreng lebih populer daripada nasi putih? Karena nasi putih gak ada suaranya pas dimasak!'
    ];

    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    m.reply(randomJoke);
};

handler.command = /^joke$/i;
handler.tags = ['fun'];
handler.help = ['joke'];

export default handler;