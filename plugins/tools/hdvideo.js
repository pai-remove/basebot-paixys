import {join} from 'path';
import {promises} from 'fs';
import {spawn} from 'child_process';

let handler = async (m, { conn, text, usedPrefix, args, command }) => {
    conn.hdvid = conn.hdvid ? conn.hdvid : {};
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime || !mime.startsWith('video/')) {
        throw `Kirim atau balas video dengan caption *${usedPrefix}${command} <level>*\n\nPilih level:\n[1] 1 (Medium)\n[2] 2 (HD)\n\nContoh: *${usedPrefix}${command} 2*`;
    }
    conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

    // Parse level (text)
    let level = parseInt(text);
    if (![1, 2].includes(level)) {
        throw `Pilihan tidak valid! Gunakan salah satu dari berikut ini:\n\n[1] 1 (Medium)\n[2] 2 (HD)\n\nContoh: *${usedPrefix}${command} 2*`;
    }

    let tinggi = q.height || 720; // Default to 720p height
    let lebar = q.width || 1280;  // Default to 720p width

    let additionalFFmpegOptions;
    if (level === 1) {
        additionalFFmpegOptions = [
            '-c:v', 'libx264',
            '-crf', args[1] || '10',
            '-b:v', args[1] || '8M',
            '-s', `${lebar * 1}x${tinggi * 1}`,
            '-x264opts', 'keyint=30:min-keyint=30',
        ];
    } else if (level === 2) {
        additionalFFmpegOptions = [
            '-c:v', 'libx264',
            '-crf', args[2] || '5',
            '-b:v', args[1] || '8M',
            '-s', `${lebar * 2}x${tinggi * 2}`,
            '-x264opts', 'keyint=30:min-keyint=30',
        ];
    }

    try {
        const videoBuffer = await q.download();
        const additionalArgs = [
            ...additionalFFmpegOptions,
            '-q:v', '60',
        ];
        const buff = await videoConvert(videoBuffer, additionalArgs);
        await conn.sendFile(m.chat, buff, 'video.mp4', 'Berikut adalah video HD Anda!', m);
    } catch (err) {
        throw `Terjadi kesalahan saat memproses video: ${err}`;
    }
};

handler.help = ['hdvideo *<video>*'];
handler.tags = ['premium'];
handler.command = /^(hdvideo|hdvideos|hdvid)$/i;
handler.premium = true;

export default handler;

async function videoConvert(buffer, input = []) {
    return new Promise(async (resolve, reject) => {
        try {
            const tmpDir = join(__dirname, '../tmp');
            const tmpFile = join(tmpDir, `${+new Date()}.mp4`);
            const outFile = tmpFile.replace('.mp4', '_converted.mp4');

            await promises.mkdir(tmpDir, { recursive: true });

            await promises.writeFile(tmpFile, buffer);

            const args = [
                '-y',
                '-i', tmpFile,
                ...input,
                outFile,
            ];

            const ffmpegProcess = spawn('ffmpeg', args);

            ffmpegProcess.on('error', reject);
            ffmpegProcess.on('close', async (code) => {
                try {
                    await promises.unlink(tmpFile);
                    if (code !== 0) return reject(`FFmpeg exited with code ${code}`);
                    const outputVideoBuffer = await promises.readFile(outFile);
                    await promises.unlink(outFile);
                    resolve(outputVideoBuffer);
                } catch (e) {
                    reject(e);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}