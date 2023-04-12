const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const dotenv = require("dotenv");
dotenv.config();

const flujoSiges = require('./components/flujoSiges.js')
const flujoImpresoraFiscal = require('./components/flujoImpresoraFiscal.js')
const flujoImpresoraComun = require('./components/flujoImpresoraComun.js')
const flujoDespachosCeo = require('./components/flujoDespachosCeo.js')
const flujoServidor = require('./components/flujoServidor.js')
const flujoLibroIva = require('./components/flujoLibroIva.js')
const flujoAplicaciones = require('./components/flujoAplicaciones.js')
const flujoConocido = require('./components/flujoConocido.js')
const flujoDesconocido = require('./components/flujoDesconocido.js')
const {addProps,deleteTicketData,validateUser,computers,computerOptions,computerInfo} = require('./components/utils.js')

const {useMultiFileAuthState} = require('@adiwajshing/baileys')

const { default: makeWASocket } = require('@adiwajshing/baileys')

const opcionesProblema = ['Sistema SIGES','Impresora fiscal','Impresora común','Despachos CEO','Servidor','Libro IVA','Aplicaciones']

const saludo = ['Gracias por comunicarte con Sistema Siges.','Indique el numero de la opción deseada',`1. Necesito generar un ticket de soporte`,'2. Necesito comunicarme con el operador de guardia por un problema urgente (FIN DE SEMANA)']

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
    if(ctx.body === '2'){
        return endFlow({body: `El nuevo telefono de guardia es ${process.env.GUARDIA}, comuniquese directamente si el problema es de caracter urgente. Para volver a comenzar escriba "Inicio"`})
    }
    if(ctx.body !== '1'){
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

/*
.addAnswer(['Para generar un ticket de soporte necesitamos validar la cuenta.','Por favor ingresa el codigo de cliente.'],
{
    capture: true
},
async (ctx, {flowDynamic,endFlow}) => {
    let id = ctx.body
    const user = await validateUser(id)
    if(!user){
        return endFlow({body: '❌ ID invalido ❌',
        buttons:[{body:'Inicio' }]
        })
    }
   
    addProps({id: id})
    addProps({phone: ctx.from})
    await computers(id)
    const pcs = await computerOptions();
    setTimeout(()=> {
        flowDynamic(pcs)
    },500)
    
}) */
.addAnswer(['Para brindar soporte de una manera mas eficiente necesitamos validar la cuenta.','Por favor ingresa la opcion correcta.','Conoce su codigo de identificacion ?','1. Si','2. No'],
{
    capture: true
},
(ctx) => {
    if(ctx.body === "2"){

    addProps({id: "No brinda identificador"})
    addProps({email: "No brinda identificador"})
    addProps({phone: ctx.from})

    }
},
[flujoDesconocido,flujoDesconocido])

/* .addAnswer(['Para brindar soporte de una manera mas eficiente necesitamos validar la cuenta.','Por favor ingresa la opcion correcta.','Conoce su codigo de identificacion ?','1. Si','2. No'],
{
    capture: true
},
async (ctx, {flowDynamic,endFlow,gotoFlow}) => {
    let id = ctx.body

    if(id !== "0"){
    const user = await validateUser(id)
    if(!user){
        return endFlow({body: '❌ ID invalido ❌ Escriba "Inicio" para volver a comenzar'
        })
    }
   
    addProps({id: id})
    addProps({phone: ctx.from})
    await computers(id)
    const pcs = await computerOptions();
    setTimeout(()=> {
        flowDynamic(pcs)
    },500)
}else{
    addProps({id: "No brinda identificador"})
    addProps({email: "No brinda identificador"})
    addProps({phone: ctx.from})
    return gotoFlow(flujoDesconocido)
}
})
.addAnswer(['Indique el numero de la opcion que corresponda a la computadora que necesita soporte o punto de venta','Si ninguna es correcta coloque el numero 0'],
{
    capture: true
},
async (ctx) => {
    const pcs = await computerOptions();
    if(ctx.body > 0 && ctx.body <= pcs.length){
        computerInfo(ctx.body)
    }
    else{
        if(ctx.body === "0") addProps({pf: "PC no esta en nuestra base de datos"})
        else addProps({pf: ctx.body})
        addProps({tv: "Consultar al cliente tv e indentificador de PC y reportarlo"})
    }
})
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
[flujoSiges,flujoImpresoraFiscal,flujoImpresoraComun,flujoDespachosCeo,flujoServidor,flujoLibroIva,flujoAplicaciones]) */
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
