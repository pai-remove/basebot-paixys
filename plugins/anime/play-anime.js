import fetch from "node-fetch";
import * as cheerio from "cheerio";

let handler = async (m) => {
    m.reply("⏳ Sedang mengambil video anime...");

    async function animeVideo() {
        const url = "https://shortstatusvideos.com/anime-video-status-download/"; // URL sumber video
        try {
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);
            const videos = [];

            $("a.mks_button.mks_button_small.squared").each((index, element) => {
                const href = $(element).attr("href"); // Link video
                const title = $(element).closest("p").prevAll("p").find("strong").text().trim(); // Judul video
                if (href) {
                    videos.push({
                        title: title || "Anime Video",
                        source: href,
                    });
                }
            });

            if (videos.length === 0) return null;
            return videos[Math.floor(Math.random() * videos.length)];
        } catch (error) {
            console.error("Error fetching anime video:", error);
            return null;
        }
    }

    const video = await animeVideo();

    if (video) {
        let caption = `🎥 *Judul:* ${video.title}\n🔗 *Link:* ${video.source}`;
        await conn.sendMessage(m.chat, { video: { url: video.source }, caption, mimetype: "video/mp4" }, { quoted: m });
    } else {
        m.reply("❌ Tidak ada video anime yang ditemukan!");
    }
};

handler.help = ["play-anime"];
handler.tags = ["anime"];
handler.command = ["play-anime"];

export default handler;