const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true, args: ['--no-sandbox'] }
});

client.on('qr', qr => {
  console.log('🔄 Escanea este QR con WhatsApp:');
  qrcode.generate(qr, { small: true }); // Muestra QR en terminal
});

client.on('ready', () => {
  console.log('✅ Bot listo!');
});

client.initialize();

app.get('/', (req, res) => {
  res.send('<h1>🤖 Bot WhatsApp Funcionando</h1>');
});

app.get('/health', (req, res) => {
  res.json({ status: 'online', client: client.info ? 'connected' : 'connecting' });
});

app.listen(PORT, () => {
  console.log(`🌐 Servidor: http://localhost:${PORT}`);
});
