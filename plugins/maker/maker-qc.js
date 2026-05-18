import pkg from "akiraa-wb";
import axios from "axios";
const {Sticker} = pkg;

const handler = async (m, { conn, args }) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || "";
  let reply;
  if (!m.quoted) {
    reply = {};
  } else if (!q.sender === q.sender) {
    reply = {
      name: q.name,
      text: q.text || "",
      chatId: q.chat.split("@")[0],
    };
  }
  let text;
  if (args.length >= 1) {
    text = args.join(" ");
  } else if (m.quoted) {
    text = m.quoted.text || "";
  } else {
    throw "*• Example :* .qc *[text or reply message]*";
  }

  const img = await q.download?.();

  const pp = await conn
    .profilePictureUrl(q.sender, "image")
    .catch((_) => "https://telegra.ph/file/320b066dc81928b782c7b.png");

  if (mime) {
    const obj = {
      type: "quote",
      format: "png",
      backgroundColor: "#161616",
      width: 512,
      height: 768,
      scale: 2,
      messages: [
        {
          entities: [],
          media: {
            url: await Uploader.Uguu(img),
          },
          avatar: true,
          from: {
            id: m.chat.split("@")[0],
            name: q.name,
            photo: {
              url: pp,
            },
          },
          text: text || "",
          replyMessage: reply,
        },
      ],
    };

    const json = await axios.post(
      "https://quotly.netorare.codes/generate",
      obj,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const buffer = Buffer.from(json.data.result.image, "base64");
    const stickerResult = await Sticker.sticker5(
      buffer,
      false,
      global.packname,
      global.author,
    );

    if (stickerResult)
      return conn.sendFile(m.chat, stickerResult, "Quotly.webp", "", m);
  } else {
    const obj = {
      type: "quote",
      format: "png",
      backgroundColor: "#161616",
      width: 512,
      height: 768,
      scale: 2,
      messages: [
        {
          entities: [],
          avatar: true,
          from: {
            id: m.chat.split("@")[0],
            name: q.name,
            photo: {
              url: pp,
            },
          },
          text: text || "",
          replyMessage: reply,
        },
      ],
    };

    const json = await axios.post(
      "https://quotly.netorare.codes/generate",
      obj,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const buffer = Buffer.from(json.data.result.image, "base64");
    const stickerResult = await Sticker.sticker5(
      buffer,
      false,
      global.packname,
      global.author,
    );

    if (stickerResult)
      return conn.sendFile(m.chat, stickerResult, "Quotly.webp", "", m);
  }
};

handler.help = ["qc"].map((a) => a + " *[text or reply message]*");
handler.tags = ["sticker"];
handler.command = ["qc"];

export default handler;
