const { createBot, createProvider, createFlow } = require('@bot-whatsapp/bot');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const main = async () => {
  try {
    console.log('🚀 Iniciando bot...');
    
    // Para v0.1.20, la importación es diferente
    const adapterProvider = createProvider(require('@bot-whatsapp/provider-baileys'), {
      authPath: './sessions',
      onQR: async (qr) => {
        console.log('🔄 QR recibido...');
        console.log('⚠️  QR en texto (primeros 100 chars):', qr.substring(0, 100) + '...');
        // También guardamos como imagen por si acaso
        try {
          await qrcode.toFile(
            path.join(__dirname, 'bot.qr.png'),
            qr,
            { width: 300, margin: 2 }
          );
          console.log('✅ QR guardado como imagen');
        } catch (error) {
          console.log('⚠️  No se pudo guardar QR como imagen');
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
      res.json({ 
        status: 'online', 
        bot: 'SNEY-OFICIAL',
        version: '0.1.20'
      });
    });
    
    app.get('/', (req, res) => {
      res.send(`
        <html>
          <body style="text-align:center;padding:50px;">
            <h1>🤖 Bot WhatsApp</h1>
            <p>Escanea el QR en WhatsApp -> Dispositivos vinculados</p>
            <p><strong>QR en consola/logs</strong></p>
            <p><a href="/health">Estado del bot</a></p>
          </body>
        </html>
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
