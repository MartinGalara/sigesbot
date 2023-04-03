const { addKeyword } = require('@bot-whatsapp/bot')

const {sendEmail} = require('./utils.js')
const {validateUser} = require('./utils.js')
const {addProps} = require('./utils.js')
const {computers} = require('./utils.js')
const {computerOptions} = require('./utils.js')
const {computerInfo} = require('./utils.js')
const {addAudio} = require('./utils.js')
const {addImage} = require('./utils.js')

const flujoImpresoraComun = addKeyword('Impresora común')
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
})
.addAnswer(['Indique el numero de la opcion que corresponda a la computadora donde se encuentra la impresora','Si ninguna es correcta coloque el numero 0'],
{
    capture: true
},
(ctx) => {
    computerInfo(ctx.body)
})
.addAnswer('Seleccione la opcion deseada',{
    buttons: [{body: 'Soporte para impresora'},{body: 'Instalar una impresora'}],
    capture: true
},
(ctx) => {
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
    capture: true,
    buttons: [{ body: 'SI' }, { body: 'NO' }],
},
(ctx) => {
    addProps({connected: ctx.body})
})
.addAnswer(['Si desea agregar mas información o alguna descripción lo puede hacer ahora','Escriba algo o envie un AUDIO'],
{
    capture: true,
    buttons:[{body: "No agregar información"}]
},
(ctx) => {
    if(ctx.message.hasOwnProperty('audioMessage')){
        addAudio(ctx)
        addProps({description: "Audio adjuntado"})
    }else{
        addProps({description: ctx.body})
    }
})
.addAnswer(['Si desea enviar una foto aquí lo puede hacer.','De lo contrario seleccione el botón.'],
{
    capture: true,
    buttons: [{body: 'No adjuntar foto'}]
},
(ctx) => {
    if(ctx.message.hasOwnProperty('imageMessage')){
        addImage(ctx)
    }
})
.addAnswer(['Seleccione la opcion deseada'],{
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
})

module.exports = flujoImpresoraComun