export default {
  help: ["chess", "catur"],
  command: ["chess", "catur"],
  tags: ["game"],
  code: async (m, { conn, usedPrefix, command, text }) => {
    conn.chessgame = conn.chessgame || {};

    if (text === "end") {
      if (!conn.chessgame[m.chat])
        return m.reply("Anda tidak sedang dalam sesi Chess");
      delete conn.chessgame[m.chat];
      m.reply("Berhasil keluar dari sesi Chess.");
    } else if (text === "start") {
      if (conn.chessgame[m.chat])
        return conn.reply(
          m.chat,
          "Anda masih berada dalam sesi Chess",
          conn.chessgame[m.chat].msg,
        );
      try {
        const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        conn.chessgame[m.chat] = {
          fen: fen,
          player1: m.sender,
          player2: null,
          msg: null,
          acc: null,
          turn: null,
        };
        let txt = `*⌂ C H E S S - G A M E*
Terdeteksi @${m.sender.split("@")[0]} Telah memulai permainan 

*• Pilih Salah satu :*
1. Accept
2. Cancel

*👤 Reply pesan ini dengan mengetik type di atas untuk bergabung*`;
        let soal = await conn.sendMessage(m.chat, {
          text: txt,
          contextInfo: {
            externalAdReply: {
              title: "CHESS GAME",
              mediaType: 1,
              renderLargerThumbnail: true,
              thumbnail: await conn.resize(
                "https://telegra.ph/file/b40afc0d7849ccc865e3c.jpg",
                300,
                175,
              ),
              sourceUrl: "",
              mediaUrl: "https://telegra.ph/file/b40afc0d7849ccc865e3c.jpg",
            },
            mentionedJid: [m.sender],
          },
        });
        conn.chessgame[m.chat].msg = soal;
      } catch (e) {
        console.log(e);
        await m.reply("Error occurred");
      }
    } else {
      let help = `*⌂ C H E S S - G A M E*
adalah permainan strategi yang dimainkan oleh dua pemain di atas papan kotak-kotak dengan 64 petak. Setiap pemain memiliki 16 bidak yang terdiri dari raja, ratu, dua benteng, dua kuda, dua gajah, dan delapan pion. Tujuan permainan ini adalah untuk "membuat skakmat" lawan dengan mengancam raja lawan sehingga tidak dapat bergerak tanpa terancam oleh bidak lawan. Permainan catur melibatkan pemikiran strategis, perencanaan, dan taktik untuk mengalahkan lawan. ♟️👑

*⌂ C O M M A N D*
• chess start
• chess end

*👤 Max Player chess hanya 2 orang*`;
      await conn.sendMessage(
        m.chat,
        {
          text: help,
          contextInfo: {
            externalAdReply: {
              title: "CHESS GAME",
              body: "",
              thumbnailUrl: "https://telegra.ph/file/b40afc0d7849ccc865e3c.jpg",
              sourceUrl: null,
              mediaType: 1,
              renderLargerThumbnail: true,
            },
          },
        },
        { quoted: m },
      );
    }
  },
};
