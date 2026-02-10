const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const qrcode = require('qrcode-terminal');

const flowPrincipal = addKeyword(['hola']).addAnswer('Sney activo.');

const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowPrincipal]);
    const adapterProvider = createProvider(BaileysProvider);

    // ESTO VA A BLOQUEAR EL MENSAJE DEL .PNG Y MOSTRAR EL QR
    adapterProvider.on('qr', (qr) => {
        console.clear(); 
        console.log('--------------------------------------------');
        console.log('   ESCANEA ESTE CÓDIGO QR AHORA MISMO:');
        console.log('--------------------------------------------');
        qrcode.generate(qr, { small: true });
        console.log('--------------------------------------------');
        console.log('Si no ves el cuadrado, aleja el zoom con Ctrl y -');
    });

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });
};

main();
