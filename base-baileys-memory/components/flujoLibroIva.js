const { addKeyword } = require('@bot-whatsapp/bot')

const {sendEmail,addProps,addAudio,addImage,sendMessage} = require('./utils.js')

const flujoLibroIva = addKeyword('6')
/* .addAnswer('Indique donde se encuentra el inconveniente',
{
    capture: true,
    buttons:[{body:"Libro IVA Compra"},{body:"Libro IVA Venta"}]
},
(ctx) => {
    addProps({type: ctx.body})
}) */
.addAnswer(['Indique donde se encuentra el inconveniente',"1. Libro IVA Compra","2. Libro IVA Venta"],
{
    capture: true
},
(ctx) => {
    switch (ctx.body) {
        case "1":
            ctx.body = "Libro IVA Compra"
            break;
        case "2":
            ctx.body = "Libro IVA Venta"
            break;
        }
    addProps({type: ctx.body})
})
.addAnswer('Indique el período en el cual hay un inconveniente',
{
    capture: true
},
(ctx) => {
    addProps({timeFrame: ctx.body})
})
.addAnswer('Describa el problema por escrito o adjunte un AUDIO',
{
    capture: true
},
(ctx,{fallBack,flowDynamic}) => {
    if(ctx.message.hasOwnProperty('audioMessage')){
        addAudio(ctx)
        addProps({description: "Audio adjuntado"})
    }else if(ctx.message.hasOwnProperty('conversation') || ctx.message.hasOwnProperty('buttonsResponseMessage')){
        addProps({description: ctx.body})
    }
    else{
       flowDynamic([{body: "Este campo admite solo audio o texto"},{body:'Describa el problema por escrito o adjunte un AUDIO' }])
       return fallBack()
    }
    
})
/* .addAnswer(['Si desea enviar una foto aquí lo puede hacer.','De lo contrario seleccione el botón.'],
{
    capture: true,
    buttons: [{body: 'No adjuntar foto'}]
},
(ctx,{fallBack,flowDynamic}) => {
    if(ctx.message.hasOwnProperty('imageMessage')){
        addImage(ctx)
    }else if (ctx.message.hasOwnProperty('conversation') || ctx.message.hasOwnProperty('buttonsResponseMessage')){
        // descartamos que sea texto
    }else{
       flowDynamic([{body: "Este campo admite solo imagen o texto"}])
       return fallBack()
    }
    
}) */
.addAnswer(['Si desea enviar una foto aquí lo puede hacer.','De lo contrario escriba "NO".'],
{
    capture: true
},
(ctx,{fallBack,flowDynamic}) => {
    if(ctx.message.hasOwnProperty('imageMessage')){
        addImage(ctx)
    }else if (ctx.message.hasOwnProperty('conversation') || ctx.message.hasOwnProperty('buttonsResponseMessage')){
        // descartamos que sea texto
    }else{
       flowDynamic([{body: "Este campo admite solo imagen o texto"}])
       return fallBack()
    }
    
})
/* .addAnswer(['Seleccione la opcion deseada'],{
    capture: true,
    buttons: [{ body: 'Enviar ticket' }, { body: 'Cancelar ticket' }],
},
async (ctx,{endFlow}) =>{
    if(ctx.body === 'Enviar ticket') {
        const ticket = await sendEmail()
        return endFlow({body: `Tu numero de ticket es ${ticket}. Gracias por comunicarse con nosotros.`
        })
    }
    else{
        return endFlow({body: 'Se cancelo el envio del ticket',
        buttons:[{body:'Inicio' }]
        })
    }
}) */
.addAnswer(['Que nivel de urgencia le daria a este ticket','1. Bajo','2. Medio','3. Alto'],{
    capture: true
},
async (ctx,{flowDynamic}) =>{
    switch (ctx.body) {
        case "1":
            ctx.body = "Bajo"
            break;
        case "2":
            ctx.body = "Medio"
            flowDynamic([{body:`Si es fin de semana, luego de generar el ticket, comuniquese al nuevo telefono de guardia: ${process.env.GUARDIA}`}])
            break;
        case "3":
            ctx.body = "Alto"
            flowDynamic([{body:`Si es fin de semana, luego de generar el ticket, comuniquese al nuevo telefono de guardia: ${process.env.GUARDIA}`}])
            break;
        case "4":
            ctx.body = "No especifica"
        break;
    }
    addProps({priority: ctx.body})
})
.addAnswer(['Seleccione la opcion deseada','1. Enviar ticket','2. Cancelar ticket'],{
    capture: true
},
async (ctx,{endFlow,provider}) =>{
    if(ctx.body === '1') {
        const ticket = await sendEmail()
        await sendMessage(provider)
        if(!ticket){
            return endFlow({body: `Ticket generado exitosamente. Gracias por comunicarse con nosotros.`})
        }
        return endFlow({body: `Tu numero de ticket es ${ticket}. Gracias por comunicarse con nosotros.`})
    }
    else{
        return endFlow({body: 'Se cancelo el envio del ticket. Escriba "Inicio" para volver a comenzar'
        })
    }
})

module.exports = flujoLibroIva