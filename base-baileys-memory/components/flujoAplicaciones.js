const { addKeyword } = require('@bot-whatsapp/bot')

const {tvInDb,sendEmail,addProps,addAudio,addImage,sendMessage} = require('./utils.js')

const flujoAplicaciones = addKeyword('2')
.addAnswer(['Elija en que aplicación esta teniendo el inconveniente','1. App YPF','2. Mercado Pago','3. Todas las aplicaciones'],
{
    capture: true
},
(ctx) => {
    switch (ctx.body) {
        case "1":
            ctx.body = "Soporte para App YPF"
            break;
        case "2":
            ctx.body = "Instalar una Mercado Pago"
            break;
        case "3":
            ctx.body = "Todas las aplicaciones"
            break;
    }
    addProps(ctx.from,{type: ctx.body})
})
.addAnswer('Describa el problema por escrito o adjunte un AUDIO',
{
    capture: true
},
async (ctx,{fallBack,flowDynamic,provider}) => {
    if(ctx.message.hasOwnProperty('audioMessage')){
        addAudio(ctx.from,ctx)
        addProps(ctx.from,{description: "Audio adjuntado"})
    }else if(ctx.message.hasOwnProperty('conversation') || ctx.message.hasOwnProperty('buttonsResponseMessage')){
        addProps(ctx.from,{description: ctx.body})
    }
    else{
       flowDynamic([{body: "Este campo admite solo audio o texto"}])
       return fallBack()
    }

    if(!tvInDb(ctx.from)){
        const prov = provider.getInstance()
        await prov.sendMessage(`${ctx.from}@s.whatsapp.net`,{text:`Si es posible, en esta sección adjunte una foto con la ID y contraseña de Team Viewer`})
    }
    
})
.addAnswer(['Si desea, puede adjuntar hasta 3 fotos','Adjunte la foto 1','De lo contrario envíe "0".'],
{
    capture: true
},
(ctx,{fallBack,flowDynamic}) => {
    if(ctx.message.hasOwnProperty('imageMessage')){
        addImage(ctx.from,ctx)
    }else if (ctx.message.hasOwnProperty('conversation') || ctx.message.hasOwnProperty('buttonsResponseMessage')){
        // descartamos que sea texto
    }else{
       flowDynamic([{body: "Este campo admite solo imagen o texto"}])
       return fallBack()
    }
    
})
.addAnswer(['Adjunte la foto 2','De lo contrario envíe "0".'],
{
    capture: true
},
(ctx,{fallBack,flowDynamic}) => {
    if(ctx.message.hasOwnProperty('imageMessage')){
        addImage(ctx.from,ctx)
    }else if (ctx.message.hasOwnProperty('conversation') || ctx.message.hasOwnProperty('buttonsResponseMessage')){
        // descartamos que sea texto
    }else{
       flowDynamic([{body: "Este campo admite solo imagen o texto"}])
       return fallBack()
    }
    
})
.addAnswer(['Adjunte la foto 3','De lo contrario envíe "0".'],
{
    capture: true
},
(ctx,{fallBack,flowDynamic}) => {
    if(ctx.message.hasOwnProperty('imageMessage')){
        addImage(ctx.from,ctx)
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
            break;
        case "3":
            ctx.body = "Alto"
            break;
        case "4":
            ctx.body = "No especifica"
        break;
    }
    addProps(ctx.from,{priority: ctx.body})
})
.addAnswer(['Elija la opcion deseada','1. Enviar ticket','2. Cancelar ticket'],{
    capture: true
},
async (ctx,{endFlow,provider}) =>{
    if(ctx.body === '1') {
        const ticket = await sendEmail(ctx.from)

        if(ticket){
            const prov = provider.getInstance()
            await prov.sendMessage(`${ctx.from}@s.whatsapp.net`,{text:`Tu numero de ticket es ${ticket}.`})
        }else{
            const prov = provider.getInstance()
            await prov.sendMessage(`${ctx.from}@s.whatsapp.net`,{text:`Ticket generado exitosamente.`})
        }
        await sendMessage(ctx.from,provider,ticket)
       
        return endFlow({body: `Gracias por comunicarse con nosotros.`}) 
    }
    else{
        return endFlow({body: 'Se cancelo el envio del ticket. Escriba "sigesbot" para volver a comenzar'
        })
    }
})

module.exports = flujoAplicaciones