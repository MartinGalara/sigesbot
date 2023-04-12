const { addKeyword } = require('@bot-whatsapp/bot')

const {sendEmail} = require('./utils.js')
const {addProps} = require('./utils.js')
const {addAudio} = require('./utils.js')
const {addImage} = require('./utils.js')

const flujoSiges = addKeyword('1')
/* .addAnswer('Indique el origen del problema',
{
    capture: true,
    buttons:[{body:"Facturación"},{body:"Cierre de turno"},{body:"Informes"},{body:"Otro"}]
},
(ctx,{flowDynamic}) => {
    if(ctx.body === "Informes"){
        flowDynamic([{body:"En la siguiente seccion indicar en que tipo de informe ocurre el problema"}])
    }
    addProps({type: ctx.body}) 
}) */
.addAnswer(['Indique el origen del problema','1. Facturación','2. Cierre de turno','3. Informes','4. Otro'],
{
    capture: true
},
(ctx,{flowDynamic}) => {
    switch (ctx.body) {
        case "1":
            ctx.body = "Facturación"
            break;
        case "2":
            ctx.body = "Cierre de turno"
            break;
        case "3":
            ctx.body = "Informes"
            flowDynamic([{body:"En la siguiente seccion indicar en que tipo de informe ocurre el problema"}])
            break;
        case "4":
            ctx.body = "Otro"
        break;
    }
    addProps({type: ctx.body}) 
    console.log("llegue aca")
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
.addAnswer(['Seleccione la opcion deseada','1. Enviar ticket','2. Cancelar ticket'],{
    capture: true
},
async (ctx,{endFlow}) =>{
    if(ctx.body === '1') {
        const ticket = await sendEmail()
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

module.exports = flujoSiges 