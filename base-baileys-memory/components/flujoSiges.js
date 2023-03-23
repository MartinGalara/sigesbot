const { addKeyword } = require('@bot-whatsapp/bot')

const {sendEmailSiges} = require('./utils.js')
const {validateUser} = require('./utils.js')
const {addProps} = require('./utils.js')

const flujoSiges = addKeyword('Sistema SIGES')
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
.addAnswer('Indique punto de facturacion',
{
    capture: true
},
(ctx) => {
    addProps({pf: ctx.body})
})
.addAnswer('Ingrese una descripcion del problema',
{
    capture: true
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
        sendEmailSiges()
        return endFlow({body: 'Ticket generado. Gracias por comunicarse con nosotros.'
        })
    }
    else{
        return endFlow({body: 'Se cancelo el envio del ticket',
        buttons:[{body:'Inicio' }]
        })
    }
})

module.exports = flujoSiges 