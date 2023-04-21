const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const {default: makeWASocket} = require('@adiwajshing/baileys')
const { BufferJSON, useMultiFileAuthState } =require('@adiwajshing/baileys')

const dotenv = require("dotenv");
dotenv.config();

const flujoSiges = require('./components/flujoSiges.js')
const flujoImpresoraFiscal = require('./components/flujoImpresoraFiscal.js')
const flujoImpresoraComun = require('./components/flujoImpresoraComun.js')
const flujoDespachosCio = require('./components/flujoDespachosCio.js')
const flujoServidor = require('./components/flujoServidor.js')
const flujoLibroIva = require('./components/flujoLibroIva.js')
const flujoAplicaciones = require('./components/flujoAplicaciones.js')

const {isUnknown,addProps,deleteTicketData,validateUser,computers,computerOptions,computerInfo,sendMessage} = require('./components/utils.js')

const opcionesProblema = ['Despachos CIO','Aplicaciones','Impresora Fiscal / Comandera','Impresora Común / Oficina','Sistema SIGES','Libro IVA','Servidor']

const saludo = ['Gracias por comunicarte con Sistema SIGES.','Elija el numero de la opción deseada',`1. Generar un ticket de soporte`,'2. Salir']

const opciones = ['Indique el numero de la opción correspondiente al servicio en el que necesita soporte','1. Despachos CIO','2. Aplicaciones','3. Impresora Fiscal / Comandera','4. Impresora Común / Oficina','5. Sistema SIGES','6. Libro IVA','7. Servidor']

const objOpciones = {
    1: "Despachos CIO",
    2: "Aplicaciones",
    3: "Impresora Fiscal / Comandera",
    4: "Impresora Común / Oficina",
    5: "Sistema SIGES",
    6: "Libro IVA",
    7: "Servidor"
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const flujoPrincipal = addKeyword(['botbot'])
.addAnswer(saludo,
{
    capture: true
},
(ctx,{endFlow}) => {
    deleteTicketData(ctx.from)
    if(ctx.body === '2'){
        return endFlow({body: `Escriba "Inicio" para volver a comenzar`})
    }
    if(ctx.body !== '1'){
        return endFlow({body: '❌ Respuesta invalida ❌ Escriba "Inicio" para volver a comenzar'
        })
    }
})
.addAnswer(["Elija para qué necesita soporte","1. YPF (Estación)","2. SHELL (Estación)","3. AXION (Estación)","4. PUMA (Estación)","5. GULF (Estación)","6. REFINOR (Estación)","7. BLANCA (Estación)","8. SHOP","9. OTRO"],
    {
        capture: true
    },
    (ctx,{flowDynamic,fallBack}) => {
       switch (ctx.body) {
        case "1": 
            flowDynamic([{body: "Ingrese su numero de APIES"}])
            break;
        case "2": 
            flowDynamic([{body: "Ingrese su numero de identificacion SHELL"}])
            break;
        case "3": 
            flowDynamic([{body: "Ingrese su numero de identificacion AXION"}])
            break;
        case "4": 
            flowDynamic([{body: "Ingrese su numero de identificacion PUMA"}])
            break;
        case "5": 
            flowDynamic([{body: "Ingrese su numero de identificacion GULF"}])
            break;
        case "6": 
            flowDynamic([{body: "Ingrese su numero de identificacion REFINOR"}])
            break;   
        case "7": 
            flowDynamic([{body: "Ingrese su numero de identificacion"}])
            break;
        case "8": 
            flowDynamic([{body: "Ingrese su numero de identificacion"}])
            break;
        case "9": 
            flowDynamic([{body: "Ingrese su numero de identificacion"}])
            break;
       
        default:
            return fallBack();
            break;
       }
    })
.addAnswer(['Si no lo conoce envie "0"'],
{
    capture: true
},
async (ctx, {flowDynamic,endFlow}) => {
    let id = ctx.body

if(id !== "0"){
    const user = await validateUser(ctx.from,id)
    if(!user){
        return endFlow({body: '❌ ID invalido ❌ Escriba "Inicio" para volver a comenzar'
        })
    }
    addProps(ctx.from,{unknown: false})
    addProps(ctx.from,{id: id})
    addProps(ctx.from,{phone: ctx.from})
    await computers(ctx.from,id)
    const pcs = computerOptions(ctx.from);
    setTimeout(()=> {
        flowDynamic(pcs)
    },500)
}else{
    addProps(ctx.from,{unknown: true})
    addProps(ctx.from,{id: "No brinda identificador"})
    addProps(ctx.from,{email: "No brinda identificador"})
    addProps(ctx.from,{tv: "No brinda identificador"})
    addProps(ctx.from,{pf: "No brinda identificador"})
    addProps(ctx.from,{vip: null})
    addProps(ctx.from,{phone: ctx.from})
    const pcs = computerOptions(ctx.from);
    setTimeout(()=> {
        flowDynamic(pcs)
    },500)
}
})
.addAnswer(['Verificando'],
{
    capture: true
},
async (ctx) => {

    if(!isUnknown(ctx.from)){
        const pcs = computerOptions(ctx.from);
        if(ctx.body > 0 && ctx.body <= pcs.length){
            computerInfo(ctx.from,ctx.body)
        }
        else{
            if(ctx.body === "0") addProps(ctx.from,{pf: "PC no esta en nuestra base de datos"})
            else addProps(ctx.from,{pf: ctx.body})
            addProps(ctx.from,{tv: "Consultar al cliente tv e indentificador de PC y reportarlo"})
        }
    }
    else{
        addProps(ctx.from,{info: ctx.body})
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
    addProps(ctx.from,{problem: ctx.body})
},
[flujoSiges,flujoImpresoraFiscal,flujoImpresoraComun,flujoDespachosCio,flujoServidor,flujoLibroIva,flujoAplicaciones])

const asd = addKeyword(['asdasd'])
.addAnswer(['enviar mensaje'],
{
    capture: true
},
async (ctx,{provider}) => {

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
