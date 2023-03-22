const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const flujoSiges = require('./components/flujoSiges.js')

const flujoImpresoraFiscal = require('./components/flujoImpresoraFiscal.js')

const flujoImpresoraComun = require('./components/flujoImpresoraComun.js')

const {addProps} = require('./components/utils.js')

//////////////////////////////////////////////////////////////////////// FLUJO IMPRESORA COMUN ////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////// FLUJO IMPRESORA FISCAL ////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////// FLUJO SISTEMA SIGES ////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const flujoPrincipal = addKeyword(['pepito'])
.addAnswer(['Gracias por comunicarte con Sistema Siges.','En que podemos ayudarte ?'],
{
    buttons: [{ body: 'Necesito un instructivo' }, { body: 'Necesito soporte' }],
    capture: true
},
(ctx,{endFlow}) => {
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
    buttons: [{ body: 'Sistema SIGES' }, { body: 'Impresora fiscal' }, { body: 'Impresora común'}],
},
(ctx, {endFlow}) => {
    if(ctx.body !== 'Sistema SIGES' && ctx.body !== 'Impresora fiscal' && ctx.body !== 'Impresora común' ) {
        return endFlow({body: '❌ Respuesta invalida ❌',
        buttons:[{body:'Inicio' }]
        })
    }
    addProps({problem: ctx.body})
},
[flujoSiges,flujoImpresoraFiscal,flujoImpresoraComun])

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
