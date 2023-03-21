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

const flujoPrincipal = addKeyword(['hola','soporte','ayuda'])
.addAnswer(['Gracias por comunicarte con Sistema Siges.','Para generar un ticket de soporte necesitamos validar la cuenta.','Por favor ingresa el correo electronico.'],
{
    capture: true
},
async (ctx, {fallBack,flowDynamic}) => {
    if(!ctx.body.includes('@')) {
        await flowDynamic([{body:'Correo invalido'}])
        return fallBack()
    }
    let email = ctx.body
    const user = validateUser(email)
    if(!user){
        await flowDynamic([{body:'Correo invalido'}])
        return fallBack()
    }
    ticket.email = email
})
.addAnswer(['Ingresa una descripcion del problema'],
{
    capture: true
},
(ctx) => {
    ticket.description = ctx.body
})
.addAnswer(['Ingresa un telefono de contacto'],
{
    capture: true
},
(ctx) => {
    ticket.phone = ctx.body
    sendEmail(ticket)
})
.addAnswer(['A la brevedad un operador se contactara con ustedes para solucionar el problema','Gracias por comunicarse!'])

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
