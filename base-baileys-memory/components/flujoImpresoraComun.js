const { addKeyword } = require('@bot-whatsapp/bot')

const {sendEmail,addProps,addAudio,addImage,sendMessage} = require('./utils.js')

const flujoImpresoraComun = addKeyword('3')
.addAnswer(['Seleccione la opcion deseada','1. Soporte para impresora','2. Instalar una impresora'],{
    capture: true
},
(ctx) => {
    switch (ctx.body) {
        case "1":
            ctx.body = "Soporte para impresora"
            break;
        case "2":
            ctx.body = "Instalar una impresora"
            break;
    }
    addProps({type: ctx.body})
})
.addAnswer('Indique marca y modelo de la impresora',
{
    capture: true
},
(ctx) => {
    addProps({model: ctx.body})
})
.addAnswer('La impresora se encuentra conectada ?',
{
    capture: true
},
(ctx) => {
    addProps({connected: ctx.body})
})
.addAnswer(['Si desea agregar mas información o alguna descripción lo puede hacer ahora','Escriba algo o envie un AUDIO','De lo contrario escriba NO'],
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
       flowDynamic([{body: "Este campo admite solo audio o texto"},{body:'Escriba algo o envie un AUDIO' }])
       return fallBack()
    }
    
})
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

module.exports = flujoImpresoraComun