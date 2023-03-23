const { addKeyword } = require('@bot-whatsapp/bot')

const {sendEmailImpComun} = require('./utils.js')
const {validateUser} = require('./utils.js')
const {addProps} = require('./utils.js')

const flujoImpresoraComun = addKeyword('Impresora común')
.addAnswer(['Para generar un ticket de soporte necesitamos validar la cuenta.','Por favor ingresa el correo electronico.'],
{
    capture: true
},
async (ctx, {endFlow}) => {
    if(!ctx.body.includes('@')) {
        return endFlow({body: '❌ Correo invalido ❌',
        buttons:[{body:'Inicio' }]
        })
    }
    let email = ctx.body
    const user = await validateUser(email)
    if(!user){
        return endFlow({body: '❌ Correo invalido ❌',
        buttons:[{body:'Inicio' }]
        })
    }
   
    addProps({email: email})
})
.addAnswer('Ingrese el domicilio',
{
    capture: true
},
(ctx) => {
    addProps({adress: ctx.body})
})
.addAnswer('Ingrese telefono de contacto',
{
    capture: true
},
(ctx) => {
    addProps({phone: ctx.body})
})
.addAnswer('Ingrese ID de TeamViewer',
{
    capture: true
},
(ctx) => {
    addProps({idTV: ctx.body})
})
.addAnswer('Ingrese contraseña de TeamViewer',
{
    capture: true
},
(ctx) => {
    addProps({passTV: ctx.body})
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
    capture: true
},
(ctx) => {
    addProps({description: ctx.body})
})
.addAnswer(['Seleccione la opcion deseada'],{
    capture: true,
    buttons: [{ body: 'Enviar ticket' }, { body: 'Cancelar ticket' }],
},
(ctx,{endFlow}) =>{
    if(ctx.body === 'Enviar ticket') {
        sendEmailImpComun()
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