const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const BaileysProvider = require('@bot-whatsapp/baileys');  
const MockAdapter = require('@bot-whatsapp/database/mock');
const express = require('express');
const app = express();

// Importar tus módulos
const generalModule = require('./modules/general');
const visionModule = require('./modules/vision');

const PORT = process.env.PORT || 3000;
const TASA_BCV = process.env.TASA_BCV || 381.00;

// Health check para Coolify
app.get('/health', (req, res) => {
    res.json({ 
        status: 'online', 
        bot: 'SNEY-OFICIAL',
        version: '3.0.0',
        sistema: '27 módulos SCD2019',
        tasa_bcv: TASA_BCV
    });
});

app.listen(PORT, () => {
    console.log(`🌐 Health check en puerto ${PORT}`);
});

// Función para procesar mensajes según tus módulos
function procesarMensaje(mensaje, tieneArchivo = false) {
    // Primero aplicar lógica de vision.txt si hay archivo
    if (tieneArchivo) {
        return visionModule.procesarArchivo(mensaje);
    }
    
    // Luego aplicar lógica de general.txt
    return generalModule.procesarMensaje(mensaje);
}

// Crear flujos dinámicos basados en tus módulos
const crearFlujos = () => {
    const flujos = [];
    
    // Módulo 4: Menú principal
    flujos.push(addKeyword(['hola', 'buenas', 'saludos', 'iniciar'])
        .addAnswer(generalModule.respuestas.MENU_PRINCIPAL)
    );
    
    // Módulo 5: Streaming
    flujos.push(addKeyword(['netflix', 'disney', 'streaming', 'precio', 'cuánto', 'cuesta'])
        .addAnswer((_, { flowDynamic }) => {
            const respuesta = generalModule.calcularStreaming(TASA_BCV);
            flowDynamic(respuesta);
        })
    );
    
    // Módulo 10: Soporte técnico
    flujos.push(addKeyword(['error', 'falla', 'no funciona', 'problema', 'soporte'])
        .addAnswer(generalModule.respuestas.SOPORTE_TECNICO)
    );
    
    // Módulo 11: Trimestres
    flujos.push(addKeyword(['trimestre', 'impuesto vehicular', 'alcaldía', 'derecho de frente'])
        .addAnswer(generalModule.respuestas.TRIMESTRES)
    );
    
    // Módulo 22: RCV
    flujos.push(addKeyword(['rcv', 'seguro obligatorio', 'responsabilidad civil'])
        .addAnswer((_, { flowDynamic }) => {
            const respuesta = generalModule.calcularRCV(TASA_BCV);
            flowDynamic(respuesta);
        })
    );
    
    // Módulo 6: Créditos
    flujos.push(addKeyword(['crédito', 'préstamo', 'cdg'])
        .addAnswer(generalModule.respuestas.CREDITOS)
    );
    
    return flujos;
};

const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow(crearFlujos());
    const adapterProvider = createProvider(BaileysProvider);

    // Configuración mejorada del QR
    adapterProvider.on('qr', (qr) => {
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qr)}`;
        console.log('\n' + '='.repeat(60));
        console.log('📱 *SNEY BOT OFICIAL - ESCANEA EL QR*');
        console.log('='.repeat(60));
        console.log(`🔗 ENLACE DIRECTO: ${url}`);
        console.log('='.repeat(60));
        console.log('\n⚙️  Sistema de 27 módulos SCD2019 activado');
        console.log('💱 Tasa BCV:', TASA_BCV);
        console.log('='.repeat(60) + '\n');
    });

    adapterProvider.on('ready', () => {
        console.log('\n' + '✅'.repeat(30));
        console.log('✅ SNEY BOT - SISTEMA ACTIVADO');
        console.log('✅ Versión 3.0.0 con módulos SCD2019');
        console.log('✅ Health check: http://localhost:' + PORT + '/health');
        console.log('✅'.repeat(30) + '\n');
    });

    // Interceptar mensajes para aplicar tus reglas
    adapterProvider.on('message', async (ctx) => {
        const mensaje = ctx.body;
        const tieneArchivo = ctx.hasMedia || false;
        
        console.log(`📨 Mensaje recibido: "${mensaje.substring(0, 50)}..."`);
        
        // Aplicar lógica de tus módulos
        const respuesta = procesarMensaje(mensaje, tieneArchivo);
        
        if (respuesta) {
            await ctx.reply(respuesta);
        }
    });

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });
};

main();
