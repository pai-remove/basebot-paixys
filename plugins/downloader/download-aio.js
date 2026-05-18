import {fetch} from "undici";

async function aio(url) {
    try {
        const response = await fetch("https://anydownloader.com/wp-json/aio-dl/video-data/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Referer": "https://anydownloader.com/",
                "Token": "5b64d1dc13a4b859f02bcf9e572b66ea8e419f4b296488b7f32407f386571a0d"
            },
            body: new URLSearchParams({
                url
            }),
        });
        const data = await response.json();
        if (!data.url) return data; // No video URL returned
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`*• Example :* ${usedPrefix + command} *[video URL]*`);

    m.reply("🔍 Mencari video...");

    try {
        const videoData = await aio(text); // Fetch video info using the provided URL
        if (!videoData.url) return m.reply("Tidak dapat menemukan video. Coba URL lain.");

        let { title, url } = videoData; // Destructure the data to get the URL and title

        // Send the video as a video message, properly using the URL
        await conn.sendMessage(m.chat, {
            video: { url }, // Ensure the correct URL structure
            mimetype: 'video/mp4', // Ensure the mime type is correct for videos
            caption: title, // Optional: you can add the title as the caption
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply("Terjadi eror saat mengambil data video.");
    }
};

handler.help = ['downloadvideo'].map(v => v + ' *video URL*');
handler.tags = ['downloader'];
handler.command = /^(downloadvid|downloadvideo)$/i;

export default handler;