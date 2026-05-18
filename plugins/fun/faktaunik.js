let handler = async (m) => {
    const facts = [
        '🧠 Otak manusia dapat menghasilkan listrik yang cukup untuk menyalakan lampu kecil!',
        '🐼 Panda bisa menghabiskan sekitar 12 jam sehari hanya untuk makan bambu.',
        '🌕 Di bulan, jejak kaki manusia bisa bertahan selama jutaan tahun karena tidak ada angin atau hujan.',
        '🦄 Jerapah tidur hanya sekitar 10-30 menit sehari dan sering tidur sambil berdiri!',
        '🎵 Musik dapat meningkatkan suasana hati dan membantu mengurangi stres.',
        '🐢 Penyu sudah ada sejak zaman dinosaurus, sekitar lebih dari 200 juta tahun yang lalu.',
        '🍫 Cokelat bisa memicu hormon endorfin yang membuat seseorang merasa bahagia.',
        '🚀 Di luar angkasa, air mata tidak bisa jatuh karena gravitasi yang rendah!',
        '🔮 Lebih dari 70% permukaan Bumi ditutupi oleh air.',
        '🐝 Lebah bisa mengenali wajah manusia layaknya manusia mengenali wajah satu sama lain.',
        '🐧 Penguin adalah satu-satunya burung yang bisa berenang tetapi tidak bisa terbang.',
        '🦷 Gigi adalah satu-satunya bagian tubuh manusia yang tidak bisa memperbaiki dirinya sendiri.',
        '🐌 Siput bisa tidur hingga 3 tahun lamanya!',
        '🔑 Sidik jari koala sangat mirip dengan sidik jari manusia.',
        '🌍 Bumi adalah satu-satunya planet yang tidak dinamai berdasarkan nama dewa atau dewi.',
        '🐟 Ikan mas memiliki ingatan yang lebih baik daripada yang orang pikirkan, mereka bisa mengingat sesuatu hingga beberapa bulan.',
        '🦇 Kelelawar adalah satu-satunya mamalia yang bisa terbang.',
        '🎤 Hati manusia berdetak sekitar 100.000 kali sehari.',
        '🌈 Tidak ada dua pelangi yang benar-benar sama, setiap orang melihat pelangi dengan sudut pandang berbeda.',
        '📱 Lebih banyak orang di dunia memiliki akses ke ponsel daripada toilet bersih.',
        '🌋 Di Islandia, ada lebih dari 100 gunung berapi aktif.',
        '💧 Air panas bisa membeku lebih cepat daripada air dingin dalam kondisi tertentu (Efek Mpemba).',
        '⚡ Petir lebih panas dari permukaan matahari.',
        '🦩 Flamingo mendapatkan warna pink dari makanan yang mereka makan, yaitu udang.',
        '🐇 Kelinci tidak bisa muntah.',
        '🧊 Antartika adalah gurun terbesar di dunia meskipun tertutup es.',
        '🐜 Semut tidak memiliki paru-paru, mereka bernapas melalui pori-pori kecil di tubuh mereka.',
        '🌟 Cahaya dari bintang yang kita lihat mungkin sudah tidak ada lagi karena bintang tersebut bisa saja sudah mati.',
        '🕷️ Laba-laba bisa menghasilkan sutra yang lebih kuat daripada baja dengan berat yang sama.',
        '🐨 Koala tidur hingga 20 jam sehari.',
        '🦁 Singa betina lebih sering berburu dibandingkan singa jantan.',
        '🐍 Ular bisa tidur dengan mata terbuka karena mereka tidak memiliki kelopak mata.',
        '🧠 Otak manusia terdiri dari sekitar 75% air.',
        '🐦 Burung kolibri adalah satu-satunya burung yang bisa terbang mundur.',
        '🎮 Bermain video game bisa meningkatkan koordinasi tangan dan mata.',
        '📖 Orang yang membaca buku secara rutin cenderung lebih empatik dan mudah memahami perasaan orang lain.',
        '🎭 Tertawa dapat meningkatkan sistem kekebalan tubuh.',
        '🌠 Rata-rata ada 44 petir yang menyambar permukaan bumi setiap detik.',
        '🦜 Burung beo bisa meniru suara manusia karena memiliki struktur otot vokal yang unik.',
        '🐴 Kuda bisa tidur sambil berdiri.',
        '🐶 Anjing bisa memahami lebih dari 150 kata manusia.',
        '🌬️ Angin terkuat yang pernah tercatat di Bumi memiliki kecepatan 372 km/jam.',
        '🍯 Madu adalah satu-satunya makanan yang tidak pernah basi.',
        '🦀 Kepiting bisa berjalan ke samping karena struktur tubuh dan kakinya.',
        '🌌 Ada lebih banyak bintang di alam semesta daripada butiran pasir di semua pantai di Bumi.',
        '🐉 Komodo adalah kadal terbesar di dunia.',
        '🏊‍♂️ Manusia bisa bertahan tanpa makanan selama berminggu-minggu, tetapi hanya beberapa hari tanpa air.',
        '🦎 Jika ekor cicak putus, ekornya akan tumbuh kembali.',
        '🚀 Sebagian besar debu di rumah berasal dari kulit mati manusia.'
    ];

    const randomFact = facts[Math.floor(Math.random() * facts.length)];

    m.reply(`🧠 *Fakta Unik*\n\n${randomFact}`);
};

// Konfigurasi handler
handler.help = ['faktaunik'];
handler.tags = ['fun'];
handler.command = /^(faktaunik)$/i;
handler.limit = true;
handler.group = false;

export default handler;