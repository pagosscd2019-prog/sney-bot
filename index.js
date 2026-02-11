const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Health check para que Coolify sepa que el bot está vivo
app.get('/health', (req, res) => {
    res.json({ status: 'online', bot: 'SNEY-OFICIAL' });
});

app.listen(PORT, () => {
    console.log(`🌐 Servidor de salud activo en puerto ${PORT}`);
});

// Flujo de prueba
const flowBienvenida = addKeyword(['hola', 'buenas', 'saludos'])
    .addAnswer('✅ ¡Sney en línea! Los módulos SCD2019 están listos para configurarse.');

const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowBienvenida]);
    
    // Aquí usamos el proveedor estándar que ya viene parcheado
    const adapterProvider = createProvider(BaileysProvider);

    // Evento para capturar el QR y mostrarlo como link
    adapterProvider.on('qr', (qr) => {
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qr)}`;
        console.log('\n' + '¡'.repeat(40));
        console.log('📱 ESCANEA EL QR EN ESTE LINK:');
        console.log(url);
        console.log('¡'.repeat(40) + '\n');
    });

    adapterProvider.on('ready', () => {
        console.log('✅ SNEY BOT CONECTADO A WHATSAPP');
    });

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });
};

main();
