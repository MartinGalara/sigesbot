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

const {asdasd,addProps,deleteTicketData} = require('./components/utils.js')

const {useMultiFileAuthState} = require('@adiwajshing/baileys')

const makeWASocket = require('@adiwajshing/baileys')

const opcionesProblema = ['Sistema SIGES','Impresora fiscal','Impresora común','Despachos CEO','Servidor','Libro IVA','Aplicaciones']



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const flujoPrincipal = addKeyword(['Inicio'])
.addAnswer(['Gracias por comunicarte con Sistema Siges.','En que podemos ayudarte ?'],
{
    buttons: [{ body: 'Necesito un instructivo' }, { body: 'Necesito soporte' }],
    capture: true
},
(ctx,{endFlow}) => {
    deleteTicketData()
    if(ctx.body === 'Necesito un instructivo'){
        return endFlow({body: 'Esta sección se encuentra en desarrollo',
        buttons:[{body:'Inicio' }]
        })
    }
    if(ctx.body !== 'Necesito soporte'){
        return endFlow({body: '❌ Respuesta invalida ❌',
        buttons:[{body:'Inicio' }]
        })
    }
})
.addAnswer(['Seleccione sobre que necesita soporte'],
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
[flujoSiges,flujoImpresoraFiscal,flujoImpresoraComun,flujoDespachosCeo,flujoServidor,flujoLibroIva,flujoAplicaciones])

const asd = addKeyword(['asd'])
.addAnswer(['Foto'],
{
    capture: true
},
(ctx) => {
    console.log(ctx)
    addProps({media: ctx})
    asdasd()
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

    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')

    const conn = makeWASocket.makeWALegacySocket({ auth: state })

    conn.ev.on ('creds.update', saveCreds)

   /*  const id = '5493515724253@s.whatsapp.net'

    console.log(adapterProvider.vendor)

    await adapterProvider.sendMessage(id, { text:"asd123" },{}) */

    /*  var number = 'asdasd@s.whatsapp.net'
     var message = "asd"
     await adapterProvider.sendText(`${number}@c.us`,message)

     const modProvider = await adapterProvider.getInstance();
     await modProvider.sendMessage(`${number}@c.us`,message) */
    
}

main()
