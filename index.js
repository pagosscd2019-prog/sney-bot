const { createBot, createProvider, createFlow } = require('@bot-whatsapp/bot');
const QRPortal = require('@bot-whatsapp/portal');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const main = async () => {
  try {
    console.log('🚀 Iniciando bot...');
    
    // USANDO EL PAQUETE CORRECTO (sin barra)
    const adapterProvider = createProvider(require('@bot-whatsapp/provider-baileys'), {
      authPath: './sessions',
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
          console.log('⚠️  QR en texto:', qr.substring(0, 50) + '...');
        }
      }
    });

    // Bot mínimo
    createBot({
      flow: createFlow([]),
      provider: adapterProvider,
      database: null,
    });

    // Servidor web
    app.use(express.static(__dirname));
    
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'online', 
        bot: 'SNEY-OFICIAL',
        version: '0.1.35'
      });
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

    // Portal QR
    QRPortal();
  } catch (error) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  }
};

main();
