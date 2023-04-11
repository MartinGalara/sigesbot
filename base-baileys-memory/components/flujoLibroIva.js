const { addKeyword } = require('@bot-whatsapp/bot')

const {sendEmail} = require('./utils.js')
const {validateUser} = require('./utils.js')
const {addProps} = require('./utils.js')
const {computers} = require('./utils.js')
const {computerOptions} = require('./utils.js')
const {computerInfo} = require('./utils.js')
const {addAudio} = require('./utils.js')
const {addImage} = require('./utils.js')

/* const flujoLibroIva = addKeyword('Libro IVA')
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
const flujoLibroIva = addKeyword('6')
.addAnswer(['Para generar un ticket de soporte necesitamos validar la cuenta.','Por favor ingresa el codigo de cliente.'],
{
    capture: true
},
async (ctx, {flowDynamic,endFlow}) => {
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
.addAnswer(['Indique el numero de la opcion que corresponda a la computadora que necesita soporte','Si ninguna es correcta coloque el numero 0'],
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

module.exports = flujoLibroIva