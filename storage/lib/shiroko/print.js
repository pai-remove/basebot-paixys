import {
  WAMessageStubType,
  generateWAMessage,
  areJidsSameUser,
  proto,
  isRealMessage,
} from "@whiskeysockets/baileys";
import chalk from "chalk";
import fs from "fs";
import { fileURLToPath } from "url";

export default async (m, conn = {}, chatUpdate, isOwner) => {
  let type = m.isGroup ? "🟢 GROUP CHAT" : "🔵 PRIVATE CHAT";
  let user = global.db?.data?.users?.[m.sender] || { exp: 0, level: 0 };
  let from = (await conn.getName(m.chat)) || "Unknown Chat";
  let number = `${m.sender} [ ${m.name || "Unknown"} ]`;
  let isBot = m.isBaileys ? "✅ YA" : "❌ NO";
  let plugin = m.plugin || "None";
  let txt = m.text.length > 30 ? m.text.slice(0, 29) + "..." : m.text;
  let mimetype = m.messageStubType ? WAMessageStubType[m.messageStubType] : m.mtype;
  let creator = isOwner ? "YES" : "NOPE";

  let logMessage = `
${chalk.yellow.bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")}
     ${chalk.cyan.bold("📌 CHAT INFORMATION")}
${chalk.yellow.bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")}

📝 ${chalk.green.bold("TYPE      :")} ${type}
👤 ${chalk.cyan.bold("FROM      :")} ${from}
📞 ${chalk.blue.bold("NUMBER    :")} ${number}
🤖 ${chalk.yellow.bold("CHATBOT   :")} ${isBot}
🔌 ${chalk.magenta.bold("PLUGIN    :")} ${plugin}
🎯 ${chalk.yellow.bold("EXP       :")} ${user.exp}
📊 ${chalk.cyan.bold("LEVEL     :")} ${user.level}
🗂️ ${chalk.green.bold("MIMETYPE  :")} ${chalk.black.bgGreen(mimetype)}
👑 ${chalk.green.bold("CREATOR  :")} ${chalk.black.bgGreen(creator)}

${chalk.green.bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")}
${m.isCommand ? chalk.yellow.bold(txt) : m.error ? chalk.red.bold(txt) : chalk.white.bold(txt)}
${chalk.green.bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")}

💻 ${chalk.blue.bold("SHIROKO FORK PROJECT")}
`;

  console.log(logMessage);
};

const __filename = fileURLToPath(import.meta.url);

fs.watchFile(__filename, () => {
  fs.unwatchFile(__filename);
  console.log(chalk.redBright("Update lib"));
  import(`${import.meta.url}?update=${Date.now()}`);
});