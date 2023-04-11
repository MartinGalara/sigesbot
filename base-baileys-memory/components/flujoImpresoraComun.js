const { addKeyword } = require('@bot-whatsapp/bot')

const {sendEmail} = require('./utils.js')
const {validateUser} = require('./utils.js')
const {addProps} = require('./utils.js')
const {computers} = require('./utils.js')
const {computerOptions} = require('./utils.js')
const {computerInfo} = require('./utils.js')
const {addAudio} = require('./utils.js')
const {addImage} = require('./utils.js')

/* const flujoImpresoraComun = addKeyword('Impresora común')
.addAnswer(['Para generar un ticket de soporte necesitamos validar la cuenta.','Por favor ingresa el codigo de cliente.'],
{
    capture: true
},
async (ctx, {endFlow,flowDynamic}) => {
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
const flujoImpresoraComun = addKeyword('3')
.addAnswer(['Para generar un ticket de soporte necesitamos validar la cuenta.','Por favor ingresa el codigo de cliente.'],
{
    capture: true
},
async (ctx, {endFlow,flowDynamic}) => {
    let id = ctx.body
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
})
.addAnswer(['Indique el numero de la opcion que corresponda a la computadora donde se encuentra la impresora','Si ninguna es correcta coloque el numero 0'],
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
/* .addAnswer('Seleccione la opcion deseada',{
    buttons: [{body: 'Soporte para impresora'},{body: 'Instalar una impresora'}],
    capture: true
},
(ctx) => {
    addProps({type: ctx.body})
}) */
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
/* .addAnswer('La impresora se encuentra conectada ?',
{
    capture: true,
    buttons: [{ body: 'SI' }, { body: 'NO' }],
},
(ctx) => {
    addProps({connected: ctx.body})
}) */
.addAnswer('La impresora se encuentra conectada ?',
{
    capture: true
},
(ctx) => {
    addProps({connected: ctx.body})
})
/* .addAnswer(['Si desea agregar mas información o alguna descripción lo puede hacer ahora','Escriba algo o envie un AUDIO'],
{
    capture: true,
    buttons:[{body: "No agregar información"}]
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
    
}) */
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

module.exports = flujoImpresoraComun