import WebSocket from "ws";
import fs from "fs";

const wss = "wss://yanzbotz-waifu-yanzbotz.hf.space/queue/join";

function generateRandomLetters(length) {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const characterCount = characters.length;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characterCount);
    result += characters[randomIndex];
  }
  return result;
}

function all(data, name) {
  return new Promise(async (resolve, reject) => {
    const fileInfo = {
      base64:
        "https://yanzbotz-waifu-yanzbotz.hf.space/file=" +
        data.output.data[1].name,
    };
    const functionIndex = {
      kobo: 0,
      zeta: 0,
      gura: 20,
      kaela: 4,
      pekora: 6,
      miko: 8,
      subaru: 10,
      korone: 12,
      luna: 14,
      anya: 16,
      reine: 18,
      calli: 22,
      kroni: 24,
    };

    const fnIndex = functionIndex[name];
    if (fnIndex === undefined) {
      return reject(new Error("Invalid name provided"));
    }

    const requestPayload = {
      fn_index: fnIndex,
      session_hash: i,
    };

    const eventPayload = {
      fn_index: fnIndex,
      data: [
        {
          data: `data:audio/mpeg;base64,${Buffer.from(data).toString("base64")}`,
          name: generateRandomLetters(10) + ".mp4", // Random file name
        },
        5600, // Example size in bytes
        "pm",
        860,
        false,
        "",
        "Example string",
      ],
      event_data: null,
      session_hash: "dtniinetjz6",
    };

    const ws = new WebSocket(wss);

    ws.on("open", () => {
      console.log("Connected to WebSocket server");
      ws.send(JSON.stringify(requestPayload)); // Send initial request payload
    });

    ws.on("message", async (message) => {
      const parsedMessage = JSON.parse(message);
      switch (parsedMessage.type) {
        case "init":
          ws.send(JSON.stringify(requestPayload)); // Re-send request payload
          break;
        case "response":
          console.log("Response received:", parsedMessage.data);
          break;
        case "error":
          console.log("Error occurred");
          break;
        case "status":
          console.log("Status update:", parsedMessage.data);
          break;
        default:
          console.log("Unhandled message type:", parsedMessage.type);
      }
    });

    ws.on("close", (code) => {
      if (code === 1000) {
        console.log("Connection closed cleanly");
      } else {
        console.log("Connection closed with error code:", code);
      }
      resolve(fileInfo);
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      reject(error);
    });
  });
}

export { all };
