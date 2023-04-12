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
const {addProps,deleteTicketData,validateUser,computers,computerOptions,computerInfo} = require('./components/utils.js')

const {useMultiFileAuthState} = require('@adiwajshing/baileys')

const { default: makeWASocket } = require('@adiwajshing/baileys')

const opcionesProblema = ['Sistema SIGES','Impresora fiscal','Impresora común','Despachos CEO','Servidor','Libro IVA','Aplicaciones']

const saludo = ['Gracias por comunicarte con Sistema Siges. Si es fin de semana, para ser derivado a la guardia primero hay que generar un ticket','Indique el numero de la opción deseada',`1. Generar un ticket de soporte`,'2. Salir']

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

let unknownFlag = false;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const flujoPrincipal = addKeyword(['botbot'])
.addAnswer(saludo,
{
    capture: true
},
(ctx,{endFlow}) => {
    deleteTicketData()
    if(ctx.body === '2'){
        return endFlow({body: `Escriba "Inicio" para volver a comenzar`})
    }
    if(ctx.body !== '1'){
        return endFlow({body: '❌ Respuesta invalida ❌ Escriba "Inicio" para volver a comenzar'
        })
    }
})
.addAnswer(['Para brindar soporte de una manera mas eficiente necesitamos validar la cuenta.','Ingrese su codigo de identificacion.','Si no conoce su codigo de identificacion envie "0"'],
{
    capture: true
},
async (ctx, {flowDynamic,endFlow}) => {
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
    addProps({tv: "No brinda identificador"})
    addProps({pf: "No brinda identificador"})
    addProps({phone: ctx.from})
    const pcs = await computerOptions();
    setTimeout(()=> {
        flowDynamic(pcs)
    },500)
    unknownFlag = true;
}
})
.addAnswer(['Verificando'],
{
    capture: true
},
async (ctx) => {
    if(!unknownFlag){
        const pcs = await computerOptions();
        if(ctx.body > 0 && ctx.body <= pcs.length){
            computerInfo(ctx.body)
        }
        else{
            if(ctx.body === "0") addProps({pf: "PC no esta en nuestra base de datos"})
            else addProps({pf: ctx.body})
            addProps({tv: "Consultar al cliente tv e indentificador de PC y reportarlo"})
        }
    }
    else{
        addProps({info: ctx.body})
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
[flujoSiges,flujoImpresoraFiscal,flujoImpresoraComun,flujoDespachosCeo,flujoServidor,flujoLibroIva,flujoAplicaciones])

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
