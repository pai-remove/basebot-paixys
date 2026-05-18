import WebSocket from "ws";
import fs from "fs";
const wss = "wss://yanzbotz-instrument.hf.space/queue/join";

function generateRandomLetters(length) {
  let randomLetters = "";
  for (let i = 0; i < length; i++) {
    const randomCharCode = Math.floor(Math.random() * 26);
    const randomLetter = String.fromCharCode(
      "a".charCodeAt(0) + randomCharCode,
    );
    randomLetters += randomLetter;
  }
  return randomLetters;
}

function instrument(data) {
  return new Promise(async (resolve, reject) => {
    let result = {};
    let randomFileName =
      Math.floor(Math.random() * 100000000000000000) +
      (await generateRandomLetters()) +
      ".mp4";
    let requestData = {
      data: [
        {
          data: "data:audio/mpeg;base64," + data.toString("base64"),
          name: randomFileName,
        },
      ],
      event_data: null,
      fn_index: 0,
      session_hash: "6inywdd0rtw",
    };

    const ws = new WebSocket(wss);

    ws.onopen = function () {
      console.log("Connected to websocket");
    };

    ws.onmessage = async function (message) {
      let response = JSON.parse(message.data);
      switch (response.msg) {
        case "send_hash":
          ws.send(JSON.stringify({ fn_index: 1, session_hash: "6inywdd0rtw" }));
          break;
        case "estimation":
          console.log("Menunggu antrean: ️" + response.rank);
          break;
        case "send_data":
          console.log("Processing your audio....");
          ws.send(JSON.stringify(requestData));
          break;
        case "process_completed":
          result.vocal =
            "https://yanzbotz-instrument.hf.space/file=" +
            response.output.data[0].name;
          result.instrument =
            "https://yanzbotz-instrument.hf.space/file=" +
            response.output.data[1].name;
          break;
      }
    };

    ws.onclose = function (event) {
      event.code === 1000
        ? console.log("Process completed️")
        : console.log("Err : WebSocket Connection Error:\n");
      resolve(result);
    };
  });
}

export { instrument };
