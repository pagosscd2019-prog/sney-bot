const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Health check para Coolify (Esto evita que Coolify diga que falló)
app.get('/health', (req, res) => {
    res.json({ status: 'online', bot: 'SNEY-OFICIAL' });
});

app.listen(PORT, () => {
    console.log(`🌐 Health check activo en puerto ${PORT}`);
});

// Un flujo simple para probar que funciona
const flowBienvenida = addKeyword(['hola', 'ole', 'buenas'])
    .addAnswer('✅ ¡Sney está vivo! La conexión funciona perfectamente.');

const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowBienvenida]);
    const adapterProvider = createProvider(BaileysProvider);

    adapterProvider.on('qr', (qr) => {
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qr)}`;
        console.log('\n' + '='.repeat(40));
        console.log('📱 ESCANEA EL QR AQUÍ:');
        console.log(url);
        console.log('='.repeat(40) + '\n');
    });

    adapterProvider.on('ready', () => {
        console.log('✅ SNEY BOT CONECTADO');
    });

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });
};

main();
