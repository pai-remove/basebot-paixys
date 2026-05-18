import {createCanvas} from 'canvas';

async function handler(m, { conn, text }) {
  let name = text.trim();
  if (!name) return m.reply(`*Contoh :* .cekgenius Axel`);

  function pickRandom(list) {
    return list[Math.floor(list.length * Math.random())];
  }

  function wrapText(text, maxLength) {
    const lines = [];
    const words = text.split(' ');
    let currentLine = '';

    words.forEach(word => {
      if (currentLine.length + word.length < maxLength) {
        currentLine += word + ' ';
      } else {
        lines.push(currentLine);
        currentLine = word + ' ';
      }
    });

    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    return lines;
  }

  function getDescriptionByLevel(level) {
    if (level <= 5) return 'Baru mulai berkembang.';
    if (level <= 15) return 'Potensimu terlihat.';
    if (level <= 25) return 'Pemikiranmu tajam.';
    if (level <= 35) return 'Kecerdasan berkembang pesat.';
    if (level <= 45) return 'Semakin bijaksana.';
    if (level <= 55) return 'Hampir puncak, inovatif.';
    if (level <= 65) return 'Pemikir luar biasa.';
    if (level <= 75) return 'Mampu memecahkan masalah kompleks.';
    if (level <= 85) return 'Menuju kesempurnaan.';
    if (level <= 95) return 'Mendekati sempurna.';
    if (level === 100) return 'Jenius sejati, sempurna!';
    return 'Deskripsi tidak tersedia';
  }

  const geniusLevels = [
    'Kecerdasan Level : 4%\n\nBaru mulai berkembang.',
    'Kecerdasan Level : 7%\n\nPotensimu terlihat.',
    'Kecerdasan Level : 12%\n\nPemikiranmu tajam.',
    'Kecerdasan Level : 22%\n\nKecerdasan berkembang pesat.',
    'Kecerdasan Level : 27%\n\nSemakin bijaksana.',
    'Kecerdasan Level : 35%\n\nHampir puncak, inovatif.',
    'Kecerdasan Level : 41%\n\nPemikir luar biasa.',
    'Kecerdasan Level : 48%\n\nMampu memecahkan masalah kompleks.',
    'Kecerdasan Level : 56%\n\nMenuju kesempurnaan.',
    'Kecerdasan Level : 64%\n\nMendekati sempurna.',
    'Kecerdasan Level : 71%\n\nJenius sejati.',
    'Kecerdasan Level : 77%\n\nTak terkalahkan.',
    'Kecerdasan Level : 83%\n\nMengubah dunia.',
    'Kecerdasan Level : 90%\n\nKecerdasan luar biasa.',
    'Kecerdasan Level : 95%\n\nTak terhentikan.',
    'Kecerdasan Level : 100%\n\nJenius sejati, sempurna!'
  ];

  name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  const canvas = createCanvas(637, 400);
  const ctx = canvas.getContext('2d');

  // Background Gradient
  const colors = ['#FF1493', '#FF6347', '#FF4500', '#DC143C', '#FF8C00'];
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  colors.forEach((color, index) => {
    gradient.addColorStop(index / (colors.length - 1), color);
  });
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Title Text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 40px "Roboto", sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.shadowBlur = 10;
  ctx.fillText('HASIL PENGECEKAN GENIUS', canvas.width / 2, 50);

  // Name Text
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 48px "Lobster", cursive';
  ctx.fillText(name, canvas.width / 2, 130);

  // Progress Bar Background
  ctx.fillStyle = '#E0E0E0';
  ctx.fillRect(50, 180, 537, 20);

  const randomGenius = pickRandom(geniusLevels);
  const levelMatch = randomGenius.match(/Kecerdasan Level : (\d+)%/);

  if (!levelMatch) {
    return m.reply('⚠️ Terjadi kesalahan dalam mendapatkan level kecerdasan!');
  }

  const level = parseInt(levelMatch[1]);
  const progressWidth = (537 * level) / 100;

  // Progress Bar Gradient
  const progressGradient = ctx.createLinearGradient(50, 180, 587, 180);
  progressGradient.addColorStop(0, '#1E90FF');
  progressGradient.addColorStop(1, '#32CD32');
  ctx.fillStyle = progressGradient;
  ctx.fillRect(50, 180, progressWidth, 20);

  // Level Percentage Text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px "Poppins", sans-serif';
  ctx.fillText(`${level}%`, 170, 195);

  // Description Text
  const description = getDescriptionByLevel(level);
  const lines = wrapText(description, 80);

  let textY = 230;
  if (lines.length > 3) {
    textY = 280;
  }

  ctx.fillStyle = '#FFFF00'; // Text color
  ctx.font = 'bold 20px "Lora", serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.shadowBlur = 10;
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#FF4500'; // Stroke color
  lines.forEach((line, index) => {
    const lineY = textY + (index * 25);
    ctx.strokeText(line, canvas.width / 2, lineY);
    ctx.fillText(line, canvas.width / 2, lineY);
  });

  const buffer = canvas.toBuffer();
  conn.sendFile(m.chat, buffer, 'genius.png', 'Ini adalah hasil cek kecerdasanmu!', m);
}

handler.help = ['cekgenius'];
handler.tags = ['game'];
handler.command = /^(cekgenius)$/i;

export default handler;