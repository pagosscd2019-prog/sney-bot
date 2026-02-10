const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const qrcode = require('qrcode-terminal'); // <-- Línea añadida para poder ver el QR

// Flujo simple que ya vimos que funciona
const flowPrincipal = addKeyword(['hola', 'buenas', 'info'])
    .addAnswer('¡Hola! Soy Sney. Estoy terminando de configurar mi cerebro.');

const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowPrincipal]);
    const adapterProvider = createProvider(BaileysProvider);

    // --- BLOQUE AÑADIDO PARA MOSTRAR EL QR EN PANTALLA ---
    adapterProvider.on('qr', (qr) => {
        console.log("ESCANEA ESTE CÓDIGO QR:");
        qrcode.generate(qr, { small: true });
    });
    // ----------------------------------------------------

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });
};

main();
