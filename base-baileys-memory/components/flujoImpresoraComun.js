const { addKeyword } = require('@bot-whatsapp/bot')

const {sendEmail} = require('./utils.js')
const {validateUser} = require('./utils.js')
const {addProps} = require('./utils.js')

const flujoImpresoraComun = addKeyword('Impresora común')
.addAnswer(['Para generar un ticket de soporte necesitamos validar la cuenta.','Por favor ingresa el codigo de cliente.'],
{
    capture: true
},
async (ctx, {endFlow}) => {
    let id = ctx.body
    const user = await validateUser(id)
    if(!user){
        return endFlow({body: '❌ ID invalido ❌',
        buttons:[{body:'Inicio' }]
        })
    }
   
    addProps({id: id})
    addProps({phone: ctx.from})
})
.addAnswer('Seleccione la opcion deseada',{
    buttons: [{body: 'Soporte para impresora'},{body: 'Instalar una impresora'}],
    capture: true
},
(ctx) => {
    addProps({type: ctx.body})
})
.addAnswer('Indique en que computadora se encuentra la impresora',
{
    capture: true
},
(ctx) => {
    addProps({pf: ctx.body})
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
.addAnswer('Si desea agregar mas información o alguna descripción lo puede hacer ahora',
{
    capture: true,
    buttons:[{body: "No agregar información"}]
},
(ctx) => {
    addProps({description: ctx.body})
})
.addAnswer(['Si desea enviar una foto aquí lo puede hacer.','De lo contrario seleccione el botón.'],
{
    capture: true,
    buttons: [{body: 'No adjuntar foto'}]
},
(ctx) => {
    if(ctx.body === 'No adjuntar foto'){
        addProps({media: ctx.body})
    }
    else{
        addProps({media: ctx})
    }
    
})
.addAnswer(['Seleccione la opcion deseada'],{
    capture: true,
    buttons: [{ body: 'Enviar ticket' }, { body: 'Cancelar ticket' }],
},
(ctx,{endFlow}) =>{
    if(ctx.body === 'Enviar ticket') {
        sendEmail()
        return endFlow({body: 'Ticket generado. Gracias por comunicarse con nosotros.'
        })
    }
    else{
        return endFlow({body: 'Se cancelo el envio del ticket',
        buttons:[{body:'Inicio' }]
        })
    }
})

module.exports = flujoImpresoraComun