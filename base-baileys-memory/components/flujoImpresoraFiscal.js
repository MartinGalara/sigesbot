const { addKeyword } = require('@bot-whatsapp/bot')

const {sendEmail} = require('./utils.js')
const {validateUser} = require('./utils.js')
const {addProps} = require('./utils.js')

const flujoImpresoraFiscal = addKeyword('Impresora fiscal')
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
})
.addAnswer(['Ingresa un correo electronico.'],
{
    capture: true
},
async (ctx, {endFlow}) => {
    if(!ctx.body.includes('@')) {
        return endFlow({body: '❌ Correo invalido ❌',
        buttons:[{body:'Inicio' }]
        })
    }
   
    addProps({email: ctx.body})
})
.addAnswer('Ingrese el domicilio',
{
    capture: true
},
(ctx) => {
    addProps({address: ctx.body})
})
.addAnswer('Ingrese telefono de contacto',
{
    capture: true
},
(ctx) => {
    addProps({phone: ctx.body})
})
.addAnswer('Seleccione la opcion deseada',{
    buttons: [{body: 'Soporte para impresora fiscal'},{body: 'Instalar una impresora fiscal'}],
    capture: true
},
(ctx) => {
    addProps({type: ctx.body})
})
.addAnswer('Indique en que punto de venta se encuentra la impresora',
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
.addAnswer('La impresora se encuentra conectada ? Con que tipo de cable ?',
{
    capture: true,
    buttons: [{ body: 'SI con cable UTP' }, { body: 'SI con cable USB' }, { body: 'No se encuentra conectada' }],
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

module.exports = flujoImpresoraFiscal