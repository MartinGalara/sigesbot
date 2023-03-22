const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const axios = require('axios')

const nodemailer = require("nodemailer")

const dotenv = require("dotenv");

dotenv.config();

let ticket = {}

const sendEmail = async (ticket) => {

    console.log(ticket)

    return console.log('correo enviado')

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "mgalara@gmail.com", // generated ethereal user
          pass: process.env.GMAIL_PASS, // generated ethereal password
        },
      });
    
      await transporter.sendMail({
        from: '"Ticket" <mgalara@gmail.com>', // sender address
        to: `mgalara2@gmail.com`, // list of receivers
        subject: "Un cliente necesita soporte", // Subject line
        text: "ASD123", // plain text body
        html: `
        <div>
        <p>Datos del ticket</p>
        <p>Correo del cliente: ${ticket.email}</p>
        <p>Descripcion del problema: ${ticket.description}</p>
        <p>Telefono de contacto: ${ticket.phone}</p>
        <br></br>
        <div/>
        `, // html body
      });

}

const validateUser = async (email) => {
    
    if(email === "mgalara@gmail.com")
    {
        return {
            email: "mgalara@gmail.com",
            hashPassword: "35284017"
        }
    }
    else{
        return false
    }
    const config = {
        method: 'get',
        url: `http://localhost:3001/users?email=${email}`,
    }

    const user = await axios(config)
    if(user.data.lenth !== 0){
        return user.data[0]
    }
    else{
        return false
    }
}

//////////////////////////////////////////////////////////////////////// FLUJO IMPRESORA COMUN ////////////////////////////////////////////////////////////////////////////////
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
    ticket.email = email
})
.addAnswer('Ingrese el domicilio',
{
    capture: true
},
(ctx) => {
    ticket.adress = ctx.body
})
.addAnswer('Indique en que computadora desea instalarla / hay un problema',
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
.addAnswer(['Ingrese una descripcion del problema','Si necesita instalar una impresora','Indique marca/modelo | si se encuentra conectada'],
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

//////////////////////////////////////////////////////////////////////// FLUJO IMPRESORA FISCAL ////////////////////////////////////////////////////////////////////////////////

const flujoImpresoraFiscal = addKeyword('Impresora fiscal')
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
.addAnswer(['Ingrese una descripcion del problema','Si necesita instalar una impresora fiscal','Indique marca/modelo | si se encuentra conectada y que tipo de conexion ( USB o UTP )'],
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

//////////////////////////////////////////////////////////////////////// FLUJO SISTEMA SIGES ////////////////////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const flujoPrincipal = addKeyword(['pepito'])
.addAnswer(['Gracias por comunicarte con Sistema Siges.','En que podemos ayudarte ?'],
{
    buttons: [{ body: 'Necesito un instructivo' }, { body: 'Necesito soporte' }],
    capture: true
},
(ctx,{endFlow}) => {
    if(ctx.body === 'Necesito un instructivo'){
        return endFlow({body: 'Esta sección se encuentra en desarrollo',
        buttons:[{body:'Inicio' }]
        })
    }
    if(ctx.body !== 'Necesito soporte'){
        return endFlow({body: '❌ Respuesta invalida ❌',
        buttons:[{body:'Inicio' }]
        })
    }
})
.addAnswer(['Seleccione sobre que necesita soporte'],
{
    capture:true,
    buttons: [{ body: 'Sistema SIGES' }, { body: 'Impresora fiscal' }, { body: 'Impresora común'}],
},
(ctx, {endFlow}) => {
    if(ctx.body !== 'Sistema SIGES' && ctx.body !== 'Impresora fiscal' && ctx.body !== 'Impresora común' ) {
        return endFlow({body: '❌ Respuesta invalida ❌',
        buttons:[{body:'Inicio' }]
        })
    }
    ticket.problem = ctx.body
},
[flujoSiges,flujoImpresoraFiscal,flujoImpresoraComun])

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flujoPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
