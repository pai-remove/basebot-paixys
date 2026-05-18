import fetch from "node-fetch";
import FormData from "form-data";
import { JSDOM } from "jsdom";

async function webp2mp4(source) {
  const form = new FormData();
  const isUrl = typeof source === "string" && /https?:\/\//.test(source);
  form.append("new-image-url", isUrl ? source : "");
  form.append("new-image", isUrl ? "" : source, "image.webp");

  const res = await fetch("https://ezgif.com/webp-to-mp4", {
    method: "POST",
    body: form,
  });

  const html = await res.text();
  const { document } = new JSDOM(html).window;

  const form2 = new FormData();
  const obj = {};
  for (const input of document.querySelectorAll("form input[name]")) {
    obj[input.name] = input.value;
    form2.append(input.name, input.value);
  }

  const res2 = await fetch("https://ezgif.com/webp-to-mp4/" + obj.file, {
    method: "POST",
    body: form2,
  });

  const html2 = await res2.text();
  const { document: document2 } = new JSDOM(html2).window;

  return new URL(
    document2.querySelector("div#output > p.outfile > video > source").src,
    res2.url,
  ).toString();
}

async function webp2png(source) {
  const form = new FormData();
  const isUrl = typeof source === "string" && /https?:\/\//.test(source);
  form.append("new-image-url", isUrl ? source : "");
  form.append("new-image", isUrl ? "" : source, "image.webp");

  const res = await fetch("https://ezgif.com/webp-to-png", {
    method: "POST",
    body: form,
  });

  const html = await res.text();
  const { document } = new JSDOM(html).window;

  const form2 = new FormData();
  const obj = {};
  for (const input of document.querySelectorAll("form input[name]")) {
    obj[input.name] = input.value;
    form2.append(input.name, input.value);
  }

  const res2 = await fetch("https://ezgif.com/webp-to-png/" + obj.file, {
    method: "POST",
    body: form2,
  });

  const html2 = await res2.text();
  const { document: document2 } = new JSDOM(html2).window;

  return new URL(
    document2.querySelector("div#output > p.outfile > img").src,
    res2.url,
  ).toString();
}

// === Test section (jalan hanya kalau file dijalankan langsung)
if (import.meta.url === `file://${process.argv[1]}`) {
  webp2mp4("https://mathiasbynens.be/demo/animated-webp-supported.webp").then(
    console.log,
  );
  webp2png("https://mathiasbynens.be/demo/animated-webp-supported.webp").then(
    console.log,
  );
}

// === Export ke modul lain
export { webp2mp4, webp2png };