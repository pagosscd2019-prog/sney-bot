const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const fs = require('fs');
const axios = require('axios');
const qrcode = require('qrcode-terminal');

// Lógica de Tasa BCV
let tasaMemoria = 60.00;
async function obtenerTasaBCV() {
    try {
        const response = await axios.get('https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv');
        tasaMemoria = response.data.monitors.usd.price;
        return tasaMemoria;
    } catch (e) {
        return tasaMemoria;
    }
}

// Usamos addKeyword(null) para que atrape cualquier mensaje
const flowPrincipal = addKeyword(null)
    .addAction(async (ctx, { flowDynamic }) => {
        const tasa = await obtenerTasaBCV();
        // Aquí Sney usará tus archivos de texto y la tasa
        await flowDynamic(`Sney está procesando... (Tasa actual: ${tasa})`);
    });

const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowPrincipal]);
    const adapterProvider = createProvider(BaileysProvider);

    // ESTO FUERZA EL QR EN LA PANTALLA
    adapterProvider.on('qr', (qr) => {
        console.log("ESCANEAME POR FAVOR:");
        qrcode.generate(qr, { small: true });
    });

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });
};

main();
