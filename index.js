const { createBot, createProvider, createFlow } = require('@bot-whatsapp/bot');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const main = async () => {
  try {
    console.log('🚀 Iniciando bot con Meta Provider...');
    
    const MetaProvider = require('@bot-whatsapp/provider-meta');
    
    const adapterProvider = createProvider(MetaProvider, {
      jwtToken: 'TU_TOKEN_AQUI', // Necesitarás token de Meta
      numberId: 'TU_NUMERO_ID',
      onQR: async (qr) => {
        console.log('🔄 QR recibido...');
        try {
          await qrcode.toFile(
            path.join(__dirname, 'bot.qr.png'),
            qr,
            { width: 300, margin: 2 }
          );
          console.log('✅ QR guardado');
        } catch (error) {
          console.log('⚠️ QR en texto:', qr.substring(0, 50) + '...');
        }
      }
    });

    createBot({
      flow: createFlow([]),
      provider: adapterProvider,
      database: null,
    });

    app.use(express.static(__dirname));
    
    app.get('/health', (req, res) => {
      res.json({ status: 'online', bot: 'SNEY-OFICIAL' });
    });
    
    app.get('/', (req, res) => {
      res.send(`
        <html><body style="text-align:center;padding:50px;">
          <h1>🤖 Bot WhatsApp</h1>
          <p><a href="/bot.qr.png">Ver QR</a></p>
          <p><a href="/health">Estado</a></p>
        </body></html>
      `);
    });

    app.listen(PORT, () => {
      console.log(`🌐 Servidor: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  }
};

main();
