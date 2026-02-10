const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const qrcode = require('qrcode-terminal');

/**
 * FLUJO DE BIENVENIDA
 * Esto es lo que responderá el bot cuando alguien escriba "hola"
 */
const flowPrincipal = addKeyword(['hola', 'ole', 'buenas'])
    .addAnswer('¡Hola! Soy Sney. Ya estoy activo y listo para trabajar.');

/**
 * FUNCIÓN PRINCIPAL
 * Aquí es donde ocurre la magia del QR
 */
const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowPrincipal]);
    const adapterProvider = createProvider(BaileysProvider);

    /**
     * FUERZA EL DIBUJO DEL QR EN LA PANTALLA NEGRA
     * Esta es la parte que nos faltaba para que no pida el archivo .png
     */
    adapterProvider.on('qr', (qr) => {
        console.clear(); 
        console.log('------------------------------------------------------');
        console.log('ESCANEA EL CÓDIGO QR CON TU WHATSAPP BUSINESS:');
        console.log('------------------------------------------------------');
        qrcode.generate(qr, { small: true });
        console.log('------------------------------------------------------');
    });

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });
};

main();
