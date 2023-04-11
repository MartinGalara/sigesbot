const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const flujoSiges = require('./components/flujoSiges.js')
const flujoImpresoraFiscal = require('./components/flujoImpresoraFiscal.js')
const flujoImpresoraComun = require('./components/flujoImpresoraComun.js')
const flujoDespachosCeo = require('./components/flujoDespachosCeo.js')
const flujoServidor = require('./components/flujoServidor.js')
const flujoLibroIva = require('./components/flujoLibroIva.js')
const flujoAplicaciones = require('./components/flujoAplicaciones.js')

const {asdasd,addProps,deleteTicketData,sendMessage} = require('./components/utils.js')

const {useMultiFileAuthState} = require('@adiwajshing/baileys')

const { default: makeWASocket } = require('@adiwajshing/baileys')

const opcionesProblema = ['Sistema SIGES','Impresora fiscal','Impresora común','Despachos CEO','Servidor','Libro IVA','Aplicaciones']

const saludo = ['Gracias por comunicarte con Sistema Siges.','Indique el numero de la opción deseada',`1. Necesito un instructivo`,'2. Necesito soporte']

const opciones = ['Indique el numero de la opción correspondiente al servicio en el que necesita soporte','1. Sistema SIGES','2. Impresora fiscal','3. Impresora común','4. Despachos CEO','5. Servidor','6. Libro IVA','7. Aplicaciones']

const objOpciones = {
    1: "Sistema SIGES",
    2: "Impresora fiscal",
    3: "Impresora común",
    4: "Despachos CEO",
    5: "Servidor",
    6: "Libro IVA",
    7: "Aplicaciones"
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const flujoPrincipal = addKeyword(['Inicio'])
.addAnswer(saludo,
{
    capture: true
},
(ctx,{endFlow}) => {
    deleteTicketData()
    if(ctx.body === '1'){
        return endFlow({body: 'Esta sección se encuentra en desarrollo. Escriba "Inicio" para volver a comenzar'})
    }
    if(ctx.body !== '2'){
        return endFlow({body: '❌ Respuesta invalida ❌ Escriba "Inicio" para volver a comenzar'
        })
    }
})
/* .addAnswer(['Gracias por comunicarte con Sistema Siges.','En que podemos ayudarte ?'],
{
    buttons: [{ body: 'Necesito un instructivo' }, { body: 'Necesito soporte' }],
    capture: true
},
(ctx,{endFlow}) => {
    deleteTicketData()
    if(ctx.body === 'Necesito un instructivo'){
        return endFlow({body: 'Esta sección se encuentra en desarrollo',                            //SALUDO CON BOTONES
        buttons:[{body:'Inicio' }]
        })
    }
    if(ctx.body !== 'Necesito soporte'){
        return endFlow({body: '❌ Respuesta invalida ❌',
        buttons:[{body:'Inicio' }]
        })
    }
}) */
.addAnswer(opciones,
{
    capture:true
},
(ctx, {endFlow}) => {

    const selected = ctx.body
    ctx.body = objOpciones[selected]
    if(!opcionesProblema.includes(ctx.body)) {
        return endFlow({body: '❌ Respuesta invalida ❌ Escriba "Inicio" para volver a comenzar' 
        })
    }
    addProps({problem: ctx.body})
},
[flujoSiges,flujoImpresoraFiscal,flujoImpresoraComun,flujoDespachosCeo,flujoServidor,flujoLibroIva,flujoAplicaciones])
/* .addAnswer(['Seleccione sobre que necesita soporte'],
{
    capture:true,
    buttons: [{ body: 'Sistema SIGES' }, { body: 'Impresora fiscal' }, { body: 'Impresora común'},{ body: 'Despachos CEO'},{ body: 'Servidor'},{ body: 'Libro IVA'},{ body: 'Aplicaciones'}],
},
(ctx, {endFlow}) => {
    if(!opcionesProblema.includes(ctx.body)) {
        return endFlow({body: '❌ Respuesta invalida ❌',
        buttons:[{body:'Inicio' }]
        })
    }
    addProps({problem: ctx.body})
},
[flujoSiges,flujoImpresoraFiscal,flujoImpresoraComun,flujoDespachosCeo,flujoServidor,flujoLibroIva,flujoAplicaciones]) */

const asd = addKeyword(['asd'])
.addAnswer(['Foto'],
{
    capture: true
},
async (ctx) => {

})

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flujoPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })  

    QRPortalWeb()
    
}

main()
