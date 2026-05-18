import {Chess} from "chess.js";

async function before(m) {
  if (!m.text) return;
  if (!this.chessgame || !this.chessgame[m.chat]) return;

  const txt = m.text.toLowerCase();
  if (txt === "accept") {
    if (this.chessgame[m.chat].player1 !== m.sender) {
      if (!this.chessgame[m.chat].player2) {
        this.chessgame[m.chat].player2 = m.sender;
        this.chessgame[m.chat].turn = this.chessgame[m.chat].player2;

        const encodedFen = await conn.chessgame[m.chat].fen;
        const giliran = `\nGiliran: @${m.sender.split("@")[0]}`;
        const board = `https://chessboardimage.com/${encodedFen}.png`;

        try {
          const soal = await this.sendMessage(
            m.chat,
            {
              image: { url: board },
              caption: "🎮 *Chess start* 🎮" + giliran,
              mentions: [m.sender],
            },
            { quoted: m },
          );
          this.chessgame[m.chat].msg = soal;
        } catch (error) {
          try {
            const soal = await this.sendMessage(
              m.chat,
              {
                image: { url: board },
                caption: "🎮 *Chess start* 🎮" + giliran,
                mentions: [m.sender],
              },
              { quoted: m },
            );
            this.chessgame[m.chat].msg = soal;
          } catch (error) {
            this.reply(m.chat, "Gagal mengirim papan catur.", m);
            console.error(error);
            throw error;
          }
        }
      } else {
        this.reply(m.chat, "_Permainan sudah penuh!_", m);
      }
    } else {
      this.reply(m.chat, "Anda tidak dapat menerima permainan.", m);
    }
  } else if (txt === "cancel") {
    delete this.chessgame[m.chat];
    this.reply(m.chat, "Berhasil keluar dari sesi Chess.", m);
  } else if (/^\S+(\s|[\W])\S+$/.test(txt)) {
    if (this.chessgame[m.chat].turn === this.chessgame[m.chat].player2) {
      const chess = new Chess(await conn.chessgame[m.chat].fen);
      if (chess.isCheckmate()) {
        delete this.chessgame[m.chat];
        await this.reply(
          m.chat,
          `⚠️ *Game Checkmate.*\n🏳️ *Permainan catur dihentikan.*\n*Pemenang:* @${m.sender.split("@")[0]}`,
          m,
          {
            contextInfo: {
              mentionedJid: [m.sender],
            },
          },
        );
        return;
      }
      if (chess.isDraw()) {
        delete this.chessgame[m.chat];
        await this.reply(
          m.chat,
          `⚠️ *Game Draw.*\n🏳️ *Permainan catur dihentikan.`,
          m,
        );
        return;
      }
      const [from, to] = txt.split(" ");
      if (m.sender !== this.chessgame[m.chat].player2) {
        this.reply(m.chat, "❌ Bukan giliran Anda.", m);
      } else {
        try {
          chess.move({ from, to, promotion: "q" });
          this.chessgame[m.chat].fen = chess.fen();
          this.chessgame[m.chat].turn = this.chessgame[m.chat].player1;

          const encodedFen = await chess.fen();
          const giliran = `\nGiliran: @${this.chessgame[m.chat].turn.split("@")[0]}`;
          const flipParam =
            this.chessgame[m.chat].turn !== this.chessgame[m.chat].player1
              ? ""
              : "&flip=true";
          const flipParam2 =
            this.chessgame[m.chat].turn !== this.chessgame[m.chat].player1
              ? ""
              : "-flip";
          const board = `https://chessboardimage.com/${encodedFen + flipParam2}.png`;

          try {
            const soal = await this.sendMessage(
              m.chat,
              {
                image: { url: board },
                caption: "🎮 *Chess start* 🎮" + giliran,
                mentions: [this.chessgame[m.chat].turn],
              },
              { quoted: m },
            );
            this.chessgame[m.chat].msg = soal;
          } catch (error) {
            this.reply(m.chat, "Gagal mengirim papan catur.", m);
            console.error(error);
            throw error;
          }
        } catch (e) {
          this.reply(m.chat, "❌ *Langkah tidak valid.*", m);
          console.error(e);
        }
      }
    }
  }

  return true;
}

export default { before };
