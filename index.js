const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const qrcode = require('qrcode-terminal');

const flowPrincipal = addKeyword(['hola']).addAnswer('Sney activo y escuchando.');

const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowPrincipal]);
    const adapterProvider = createProvider(BaileysProvider);

    // ESTA ES LA LLAVE: Fuerza a la terminal a dibujar el QR
    adapterProvider.on('qr', (qr) => {
        console.log('--------------------------------------------------');
        console.log('¡AQUÍ ESTÁ TU CÓDIGO QR! ESCANEA AHORA:');
        qrcode.generate(qr, { small: true });
        console.log('--------------------------------------------------');
    });

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });
};

main();
