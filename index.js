const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');

const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([addKeyword(['hola']).addAnswer('Sney activo.')]);
    const adapterProvider = createProvider(BaileysProvider);

    // ESTA ES LA SOLUCIÓN REAL:
    adapterProvider.on('qr', (qr) => {
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr)}`;
        console.log('************************************************');
        console.log('PARA VER TU QR, COPIA Y PEGA ESTE LINK EN TU NAVEGADOR:');
        console.log(url);
        console.log('************************************************');
    });

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });
};

main();
