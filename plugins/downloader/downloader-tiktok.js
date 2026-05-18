import axios from "axios";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text)
    throw `*• Example :* ${usedPrefix + command} https://vt.tiktok.com/xxxx`;

  if (
    !/^https?:\/\/(www\.)?(tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com|m\.tiktok\.com)\//i.test(
      text
    )
  ) {
    throw "❌ URL TikTok tidak valid";
  }

  try {
    const response = await axios.request({
      method: "GET",
      url: "https://tiktok-scraper7.p.rapidapi.com/",
      params: {
        url: text,
        hd: "1",
      },
      headers: {
        "Accept": "application/json",
        "Referer": "https://rapidapi.com/",
        "Origin": "https://rapidapi.com",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "X-RapidAPI-Host": "tiktok-scraper7.p.rapidapi.com",
        "X-RapidAPI-Key": "ca5c6d6fa3mshfcd2b0a0feac6b7p140e57jsn72684628152a",
      },
      timeout: 15000,
    });

    const res = response.data?.data;
    if (!res || !res.hdplay)
      throw "❌ Video tidak tersedia";

    let cap = `┌─⭓「 *Tiktok Downloader* 」
│ *• Title :* ${res.title || "-"}
│ *• Author :* ${res.author?.nickname || "-"}
│ *• Username :* @${res.author?.unique_id || "-"}
│ *• Views :* ${Func.formatNumber(res.play_count)}
│ *• Likes :* ${Func.formatNumber(res.digg_count)}
│ *• Comment :* ${Func.formatNumber(res.comment_count)}
└───────────────⭓`;

    let last = await conn.sendMessage(
      m.chat,
      {
        video: { url: res.hdplay },
        caption: cap,
      },
      { quoted: m }
    );

    if (res.music) {
      await conn.sendMessage(
        m.chat,
        {
          audio: { url: res.music },
          mimetype: "audio/mpeg",
        },
        { quoted: last }
      );
    }
  } catch (e) {
    console.error(e?.response?.data || e);
    throw "❌ TikTok API menolak request (403)";
  }
};

handler.help = ["tt", "tiktok"].map(
  (a) => a + " *[Tiktok Url]*"
);
handler.tags = ["downloader"];
handler.command = ["tt", "tiktok"];

export default handler;