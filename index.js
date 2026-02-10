const { createBot, createProvider, createFlow, addDefaultCase } = require('@bot-whatsapp/bot');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const fs = require('fs');
const axios = require('axios');

/**
 * 1. LÓGICA DE TASA BCV AUTOMÁTICA CON RESPALDO
 */
let tasaMemoria = 60.00; // Valor inicial por seguridad

async function obtenerTasaBCV() {
    try {
        // Intentamos obtener la tasa oficial en tiempo real
        const response = await axios.get('https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv');
        const tasaHoy = response.data.monitors.usd.price;
        tasaMemoria = tasaHoy; // Actualizamos la memoria
        console.log(`[SNEY] Tasa BCV actualizada: ${tasaHoy}`);
        return tasaHoy;
    } catch (error) {
        console.log("⚠️ Error al consultar BCV. Usando tasa de respaldo:", tasaMemoria);
        return tasaMemoria;
    }
}

/**
 * 2. FLUJO PRINCIPAL DE INTELIGENCIA
 */
const flowPrincipal = addDefaultCase(async (ctx, { flowDynamic, state }) => {
    // Detectar si el mensaje es una imagen o documento
    const esArchivo = ctx.message?.imageMessage || ctx.message?.documentMessage || ctx.message?.videoMessage;
    
    // Leer el archivo de instrucciones correspondiente
    const archivoInstrucciones = esArchivo ? './vision.txt' : './general.txt';
    let promptBase = "";
    
    try {
        promptBase = fs.readFileSync(archivoInstrucciones, 'utf8');
    } catch (err) {
        promptBase = "Actúa como Sney, un asistente amable. (Error: No se encontró el archivo de reglas)";
    }

    // Obtener la tasa para esta respuesta
    const tasaActual = await obtenerTasaBCV();

    // Inyectar la tasa dinámica al principio de tus reglas
    const promptFinal = `TASA BCV DEL DÍA: ${tasaActual}\n\n${promptBase}`;

    console.log(`[SNEY] Procesando mensaje de ${ctx.from} con ${esArchivo ? 'VISIÓN' : 'TEXTO'}`);

    /**
     * NOTA: La función 'llamarIA' debe estar configurada en tu Coolify 
     * con la API Key de Gemini. Aquí simulamos la respuesta enviada al bot.
     */
    const respuestaIA = await llamarIA(ctx, promptFinal); 
    
    // Enviamos la respuesta final al cliente en un solo mensaje
    await flowDynamic(respuestaIA);
});

/**
 * 3. CONFIGURACIÓN DEL MOTOR
 */
const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowPrincipal]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });
};

main();

// Función auxiliar para conectar con Gemini (El proveedor de Coolify la usa internamente)
async function llamarIA(ctx, prompt) {
    // Esta parte la maneja el plugin de Gemini que instalaremos en Coolify
    // Solo asegúrate de tener tu GEMINI_API_KEY lista.
}
