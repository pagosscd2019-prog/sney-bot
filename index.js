const { createBot, createProvider, createFlow } = require('@bot-whatsapp/bot');
const QRPortal = require('@bot-whatsapp/portal');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const main = async () => {
  console.log('🚀 Iniciando bot de WhatsApp...');
  
  // IMPORTANTE: @bot-whatsapp/provider incluye baileys
  const BaileysProvider = require('@bot-whatsapp/provider/baileys');
  
  const adapterProvider = createProvider(BaileysProvider, {
    authPath: './sessions',
    onQR: async (qr) => {
      console.log('🔄 QR recibido...');
      
      try {
        // Guardar QR como imagen
        await qrcode.toFile(
          path.join(__dirname, 'bot.qr.png'),
          qr,
          { width: 300, margin: 2 }
        );
        console.log('✅ QR guardado como bot.qr.png');
      } catch (error) {
        console.error('❌ Error:', error.message);
      }
    }
  });

  // Bot básico
  createBot({
    flow: createFlow([]),
    provider: adapterProvider,
    database: null,
  });

  // Servidor web
  app.use(express.static(__dirname));
  
  app.get('/health', (req, res) => {
    res.json({ status: 'online', bot: 'SNEY-OFICIAL' });
  });
  
  app.get('/', (req, res) => {
    res.send(`
      <html>
        <body style="text-align:center;padding:50px;">
          <h1>🤖 Bot WhatsApp</h1>
          <p><a href="/bot.qr.png">Ver QR</a></p>
          <p><a href="/health">Estado</a></p>
        </body>
      </html>
    `);
  });

  app.listen(PORT, () => {
    console.log(`🌐 Servidor: http://localhost:${PORT}`);
  });

  QRPortal();
};
