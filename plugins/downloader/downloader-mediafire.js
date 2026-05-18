import * as cheerio from "cheerio";
import {fetch} from "undici";
import {lookup} from "mime-types";

async function mediafire(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        const type = $(".dl-btn-cont").find(".icon").attr("class").split("archive")[1]?.trim() || "unknown";
        const filename = $(".dl-btn-label").attr("title") || "unknown";
        const size = $('.download_link .input').text().trim().match(/(.*?)/)?.[1] || "unknown";
        const ext = filename.split(".").pop();
        const mimetype = lookup(ext.toLowerCase()) || "application/" + ext.toLowerCase();
        const download = $(".input").attr("href");

        if (!download) throw new Error("Gagal mendapatkan link download.");

        return {
            filename,
            type,
            size,
            ext,
            mimetype,
            download,
        };
    } catch (error) {
        throw new Error("Gagal mengambil data dari link tersebut.");
    }
}

let handler = async (m, { conn, args }) => {
    if (!args[0]) throw "Masukkan link Mediafire yang valid.";

    try {
        let result = await mediafire(args[0]);
        let caption = `*📂 MEDIAFIRE DOWNLOADER*\n\n`
            + `📌 *Nama:* ${result.filename}\n`
            + `📂 *Tipe:* ${result.type}\n`
            + `💾 *Ukuran:* ${result.size}\n`
            + `📄 *Ekstensi:* ${result.ext}\n`
            + `🖥 *MIME Type:* ${result.mimetype}\n`;

        await conn.sendMessage(m.chat, {
            document: { url: result.download },
            mimetype: result.mimetype,
            fileName: result.filename,
            caption: caption,
        }, { quoted: m });
    } catch (error) {
        console.error(error);
        m.reply("Terjadi kesalahan saat memproses permintaan. Pastikan link valid.");
    }
};

handler.help = ["mediafire"].map(v => v + " <url>");
handler.tags = ["downloader"];
handler.command = ["mediafire"];

export default handler;