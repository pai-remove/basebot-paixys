import axios from 'axios';
import crypto from 'crypto';

const savetube = {
  api: {
    base: "https://media.savetube.me/api",
    cdn: "/random-cdn",
    info: "/v2/info",
    download: "/download"
  },
  headers: {
    'accept': '*/*',
    'content-type': 'application/json',
    'origin': 'https://yt.savetube.me',
    'referer': 'https://yt.savetube.me/',
    'user-agent': 'Postify/1.0.0'
  },
  formats: ['144', '240', '360', '480', '720', '1080'],

  crypto: {
    hexToBuffer: (hexString) => Buffer.from(hexString.match(/.{1,2}/g).join(''), 'hex'),

    decrypt: async (enc) => {
      try {
        const secretKey = 'C5D58EF67A7584E4A29F6C35BBC4EB12';
        const data = Buffer.from(enc, 'base64');
        const iv = data.slice(0, 16);
        const content = data.slice(16);
        const key = savetube.crypto.hexToBuffer(secretKey);
        
        const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        let decrypted = Buffer.concat([decipher.update(content), decipher.final()]);
        
        return JSON.parse(decrypted.toString());
      } catch (error) {
        throw new Error(`${error.message}`);
      }
    }
  },

  isUrl: str => { 
    try { 
      new URL(str); 
      return true; 
    } catch (_) { 
      return false; 
    } 
  },

  youtube: url => {
    const patterns = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/
    ];
    for (let pattern of patterns) {
      if (pattern.test(url)) return url.match(pattern)[1];
    }
    return null;
  },

  request: async (endpoint, data = {}, method = 'post') => {
    try {
      const { data: response } = await axios({
        method,
        url: `${endpoint.startsWith('http') ? '' : savetube.api.base}${endpoint}`,
        data: method === 'post' ? data : undefined,
        params: method === 'get' ? data : undefined,
        headers: savetube.headers
      });
      return { status: true, code: 200, data: response };
    } catch (error) {
      return { status: false, code: error.response?.status || 500, error: error.message };
    }
  },

  getCDN: async () => {
    const response = await savetube.request(savetube.api.cdn, {}, 'get');
    return response.status ? { status: true, code: 200, data: response.data.cdn } : response;
  },

  download: async (link, format = '360') => {
    if (!link) return { status: false, code: 400, error: "Masukkan link YouTube!" };
    if (!savetube.isUrl(link)) return { status: false, code: 400, error: "Masukkan link YouTube yang valid!" };

    if (!savetube.formats.includes(format)) {
      return { 
        status: false, 
        code: 400, 
        error: `Format tidak tersedia!\nPilih salah satu: ${savetube.formats.join(', ')}` 
      };
    }

    const id = savetube.youtube(link);
    if (!id) return { status: false, code: 400, error: "Gagal mengekstrak ID video!" };

    try {
      const cdnx = await savetube.getCDN();
      if (!cdnx.status) return cdnx;
      const cdn = cdnx.data;

      const result = await savetube.request(`https://${cdn}${savetube.api.info}`, { url: `https://www.youtube.com/watch?v=${id}` });
      if (!result.status) return result;
      const decrypted = await savetube.crypto.decrypt(result.data.data);

      const dl = await savetube.request(`https://${cdn}${savetube.api.download}`, {
        id: id,
        downloadType: 'video',
        quality: format,
        key: decrypted.key
      });

      return {
        status: true,
        code: 200,
        result: {
          title: decrypted.title || "Tidak diketahui",
          format: format,
          thumbnail: decrypted.thumbnail || `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
          download: dl.data.data.downloadUrl,
          id: id,
          duration: decrypted.duration,
          quality: format
        }
      };
    } catch (error) {
      return { status: false, code: 500, error: error.message };
    }
  }
};

const handler = async (m, { conn, args }) => {
  if (args.length < 1) return m.reply("Gunakan: *ytmp4 <url>* untuk mengunduh video (360p default).");

  let url = args[0];
  let format = args[1] || '360';

  if (!savetube.isUrl(url)) return m.reply("Masukkan link YouTube yang valid!");

  try {
    let res = await savetube.download(url, format);
    if (!res.status) return m.reply(`*Error:* ${res.error}`);

    let { title, download, thumbnail } = res.result;

    await conn.sendMessage(m.chat, { 
      video: { url: download },
      caption: `🎥 *Judul:* ${title}\n🔽 *Resolusi:* ${format}p`,
      thumbnail: { url: thumbnail }
    }, { quoted: m });

  } catch (e) {
    m.reply(`*Gagal mengunduh!*`);
  }
};

handler.help = ['ytmp4','ytv'];
handler.command = ['ytmp4','ytv'];
handler.tags = ['downloader'];

export default handler;