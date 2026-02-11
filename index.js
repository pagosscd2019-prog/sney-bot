const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Health check para Coolify
app.get('/health', (req, res) => {
    res.json({ status: 'online', bot: 'SNEY-OFICIAL' });
});

app.listen(PORT, () => {
    console.log(`🌐 Servidor de salud activo en puerto ${PORT}`);
});

const flowBienvenida = addKeyword(['hola', 'iniciar'])
    .addAnswer('✅ ¡Sney en línea! Conexión exitosa desde el VPS.');

const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowBienvenida]);
    
    // Al usar BaileysProvider así, evitamos Puppeteer y el Error 127
    const adapterProvider = createProvider(BaileysProvider);

    adapterProvider.on('qr', (qr) => {
        // Genera un link para que veas el QR en el navegador
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qr)}`;
        console.log('\n' + '⭐'.repeat(40));
        console.log('📱 ESCANEA EL QR EN ESTE ENLACE:');
        console.log(url);
        console.log('⭐'.repeat(40) + '\n');
    });

    adapterProvider.on('ready', () => {
        console.log('✅ SNEY CONECTADO Y LISTO');
    });

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });
};

main().catch(err => console.error('❌ Error fatal:', err));
