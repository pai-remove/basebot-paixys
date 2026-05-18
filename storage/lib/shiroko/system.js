import cron from "node-cron";
import Function from "./func.js";
const Func = new Function();
import fetch from "node-fetch";
import {exec} from "child_process";
import util from "util";
import { fileURLToPath } from "url";
import chalk from "chalk";
import fs from "fs";

export default async (m, conn = {}, chatUpdate) => {
  if (m.mtype === "protocolMessage") return;
  const groupMetadata = await conn.groupMetadata(m.chat);
  const participants = (m.isGroup ? groupMetadata.participants : []) || [];
  const user =
    (m.isGroup
      ? participants.find((u) => conn.decodeJid(u.id) === m.sender)
      : {}) || {}; // User Data
  const botJid = await conn.signalRepository.lidMapping.getLIDForPN(
  global.numberbot + "@s.whatsapp.net"
)
      const bot =
  m.isGroup
    ? participants.find(
        (u) => conn.decodeJid(u.id) === botJid
      )
    : {}
  const isRAdmin = user?.admin === "superadmin" || false;
  const isAdmin = isRAdmin || user?.admin === "admin" || false; // Is User Admin?
  const isBotAdmin = bot?.admin === "admin" || bot?.admin === "superadmin"
  const isOwner = global.owner.includes(m.sender.split("@")[0]);

  cron.schedule(
    "00 01 * * *",
    () => {
      let users = global.db.data.users;
      let resetUsers = Object.entries(users).filter(
        ([user, data]) => data.limit < 10000000
      );

      if (resetUsers.length > 0 && !messageSent) {
        let limit = 100;
        resetUsers.forEach(([user, data]) => {
          data.limit = limit;
        });
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Jakarta",
    }
  );

  const chat = db.data.chats[m.chat];
  let detect = false;
  if (chat.antiBot) {
    if (m.isBaileys || m.id.startsWith("3EB0")) {
      if (!m.fromMe) {
        await conn.sendMessage(m.chat, {
          text: `*[ System notice ]* Detect another bot, I will kick you`,
        });
        await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove");
        await conn.delay(2000);
        detect = true;
      }
    }
  }

  let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;
  if (m.isGroup) {
    let isGroupLink = linkRegex.exec(m.text);
    if (isAdmin) return;
    if (!isBotAdmin) return;
    if (chat.antiLink && isGroupLink) {
      m.reply(
        `*[ System Detected ]* you sent another group link, I will delete this`
      );
      conn.sendMessage(m.chat, {
        delete: {
          ...m.key,
        },
      });
    }
  }
};

const __filename = fileURLToPath(import.meta.url);

fs.watchFile(__filename, () => {
  fs.unwatchFile(__filename);
  console.log(chalk.redBright("Update lib"));
  import(`${import.meta.url}?update=${Date.now()}`);
});