const { addKeyword } = require('@bot-whatsapp/bot')

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
    ticket.email = email
})
.addAnswer('Ingrese el domicilio',
{
    capture: true
},
(ctx) => {
    ticket.adress = ctx.body
})
.addAnswer('Indique punto de facturacion',
{
    capture: true
},
(ctx) => {
    ticket.pf = ctx.body
})
.addAnswer('Ingrese ID de TeamViewer',
{
    capture: true
},
(ctx) => {
    ticket.idTV = ctx.body
})
.addAnswer('Ingrese contraseña de TeamViewer',
{
    capture: true
},
(ctx) => {
    ticket.passTV = ctx.body
})
.addAnswer('Ingrese una descripcion del problema',
{
    capture: true
},
(ctx) => {
    ticket.description = ctx.body
})
.addAnswer('Ingrese telefono de contacto',
{
    capture: true
},
(ctx) => {
    ticket.phone = ctx.body
})
.addAnswer(['Seleccione la opcion deseada'],{
    capture: true,
    buttons: [{ body: 'Enviar ticket' }, { body: 'Cancelar ticket' }],
},
(ctx,{endFlow}) =>{
    if(ctx.body === 'Enviar ticket') {
        sendEmail(ticket)
        return endFlow({body: 'Ticket generado. Gracias por comunicarse con nosotros.'
        })
    }
    else{
        return endFlow({body: 'Se cancelo el envio del ticket',
        buttons:[{body:'Inicio' }]
        })
    }
})

module.exports = { flujoSiges }