import fetch from "node-fetch";

class HangmanGame {
  constructor(id) {
    this.sessionId = id;
    this.guesses = [];
    this.maxAttempts = 0;
    this.currentStage = 0;
  }

  getRandomQuest = async () => {
    try {
      const res = await fetch(`https://api.lolhuman.xyz/api/game/tebakkata?apikey=${global.lolhuman}`);
      const json = await res.json();
      if (!json || json.status !== 200) throw new Error("Failed to fetch data from API");
      const { soal, jawaban } = json.result;
      return { clue: soal, quest: jawaban.toLowerCase() };
    } catch (error) {
      console.error("Error fetching random quest:", error);
      throw new Error("Failed to fetch a random quest.");
    }
  };

  initializeGame = async () => {
    try {
      this.quest = await this.getRandomQuest();
      this.maxAttempts = this.quest.quest.length;
    } catch (error) {
      console.error("Error initializing game:", error);
      throw new Error("Failed to initialize the game.");
    }
  };

  displayBoard = () => {
    const emojiStages = ["😐", "😕", "😟", "😧", "😢", "😨", "😵"];
    return `*Current Stage:* ${emojiStages[this.currentStage]}\n\`\`\`==========\n|    |\n|   ${emojiStages[this.currentStage]}\n|   ${this.currentStage >= 3 ? "/" : ""}${this.currentStage >= 4 ? "|" : ""}${this.currentStage >= 5 ? "\\" : ""}\n|   ${this.currentStage >= 1 ? "/" : ""} ${this.currentStage >= 2 ? "\\" : ""}\n|      \n|      \n==========\`\`\`\n*Clue:* ${this.quest.clue}`;
  };

  displayWord = () =>
    this.quest.quest
      .split("")
      .map((char) => (this.guesses.includes(char) ? `${char}` : "__"))
      .join(" ");

  makeGuess = (letter) => {
    if (!this.isAlphabet(letter)) return "invalid";
    letter = letter.toLowerCase();
    if (this.guesses.includes(letter)) return "repeat";

    this.guesses.push(letter);
    if (!this.quest.quest.includes(letter)) {
      this.currentStage = Math.min(this.quest.quest.length, this.currentStage + 1);
    }

    return this.checkGameOver()
      ? "over"
      : this.checkGameWin()
        ? "win"
        : "continue";
  };

  isAlphabet = (letter) => /^[a-zA-Z]$/.test(letter);

  checkGameOver = () => this.currentStage >= this.maxAttempts;

  checkGameWin = () =>
    [...new Set(this.quest.quest)].every((char) => this.guesses.includes(char));

  getHint = () => `*Hint:* ${this.quest.quest}`;
}

const handler = async (m, { conn, usedPrefix, command, args }) => {
  conn.hangman = conn.hangman || {};
  let [action, inputs] = args;

  try {
    switch (action) {
      case "end":
        if (conn.hangman[m.chat] && conn.hangman[m.chat].sessionId === m.sender) {
          delete conn.hangman[m.chat];
          await m.reply("Successfully exited Hangman session. 👋");
        } else {
          await m.reply("No Hangman session in progress or you're not the player.");
        }
        break;

      case "start":
        if (conn.hangman[m.chat]) {
          await m.reply(`There's already a Hangman session. Use *${usedPrefix + command} end* to stop it.`);
        } else {
          conn.hangman[m.chat] = new HangmanGame(m.sender);
          const gameSession = conn.hangman[m.chat];
          await gameSession.initializeGame();
          await m.reply(
            `🎮 *Hangman Game Started!*\n\n*Session ID:* ${gameSession.sessionId}\n${gameSession.displayBoard()}\n\n*Guess the Word:*\n${gameSession.displayWord()}\n\nSend letter to guess, example: *${usedPrefix + command} guess a*`
          );
        }
        break;

      case "guess":
        if (!conn.hangman[m.chat]) return m.reply("No Hangman session found. Use *start* to begin.");
        if (!inputs || !/^[a-zA-Z]$/.test(inputs)) {
          await m.reply(`Enter a valid letter after *guess*. Example: *${usedPrefix + command} guess a*`);
          return;
        }

        const gameSession = conn.hangman[m.chat];
        const result = gameSession.makeGuess(inputs.toLowerCase());

        const messages = {
          invalid: "Enter a valid letter.",
          repeat: "You already guessed that letter.",
          continue: `*Guessed Letters:* ${gameSession.guesses.join(", ")}\n${gameSession.displayBoard()}\n\n*Word:*\n${gameSession.displayWord()}\n\n*Attempts Left:* ${gameSession.maxAttempts - gameSession.currentStage}`,
          over: `💀 Game Over! The correct word was *${gameSession.quest.quest}*.`,
          win: "🎉 Congratulations! You won the Hangman game!",
        };

        await m.reply(messages[result]);
        if (["over", "win"].includes(result)) delete conn.hangman[m.chat];
        break;

      case "hint":
        if (!conn.hangman[m.chat]) return m.reply("No session found. Use *start* first.");
        await m.reply(conn.hangman[m.chat].getHint());
        break;

      case "help":
      default:
        await m.reply(
          `*[ HANGMAN GAME ]* 🎮\n\n*Commands:*\n- *${usedPrefix + command} start* → Start the game\n- *${usedPrefix + command} guess [letter]* → Guess a letter\n- *${usedPrefix + command} hint* → Get a clue\n- *${usedPrefix + command} end* → End current session`
        );
    }
  } catch (error) {
    console.error("Error in hangman handler:", error);
    await m.reply("An error occurred while running the Hangman game. Please try again.");
  }
};

handler.help = ["hangman"];
handler.tags = ["game"];
handler.command = ["hangman"];
handler.group = true;
handler.limit = true;

export default handler;