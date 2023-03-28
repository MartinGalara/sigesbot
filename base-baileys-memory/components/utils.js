const axios = require('axios')

const nodemailer = require("nodemailer")

const dotenv = require("dotenv");

const { downloadMediaMessage } = require('@adiwajshing/baileys')

dotenv.config();

let ticket = {}

const sendEmail = async () => {

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "mgalara@gmail.com", // generated ethereal user
      pass: process.env.GMAIL_PASS, // generated ethereal password
    },
  });

  let data = {
    from: '"Ticket" <mgalara@gmail.com>', // sender address
    to: `mgalara2@gmail.com`, // list of receivers
    subject: "Un cliente necesita soporte", // Subject line
    text: "Un cliente necesita soporte", // plain text body
  }

  if(typeof ticket.media === "object" && ticket.media.message.hasOwnProperty('imageMessage')){
    const buffer = await downloadMediaMessage(ticket.media,'buffer',{ },{ })

    const image = {
      filename: 'adjunto.jpg',
      content: Buffer.from(buffer, 'base64')
    }
    data.attachments = [image]
  }

  if(ticket.problem === "Sistema SIGES"){
    data.html = `
    <div>
    <p>Datos del ticket</p>
    <p>Soporte para: ${ticket.problem}</p>
    <p>ID Cliente: ${ticket.id}</p>
    <p>Correo: ${ticket.email}</p>
    <p>Dirección: ${ticket.address}</p>
    <p>Teléfono de contacto: ${ticket.phone}</p>
    <p>Punto de facturación / PC: ${ticket.pf}</p>
    <p>Descripción del problema: ${ticket.description}</p>
    <br></br>
    </div>
    ` // html body
  }
  else{
    data.html = `
    <div>
    <p>Datos del ticket</p>
    <p>Soporte para: ${ticket.problem}</p>
    <p>ID Cliente: ${ticket.id}</p>
    <p>Correo: ${ticket.email}</p>
    <p>Dirección: ${ticket.address}</p>
    <p>Teléfono de contacto: ${ticket.phone}</p>
    <p>Solicitud: ${ticket.type}</p>
    <p>Punto de facturación / PC: ${ticket.pf}</p>
    <p>Marca / Modelo: ${ticket.model}</p>
    <p>Se encuentra conectada / Tipo de conexión: ${ticket.connected}</p>
    <p>Descripción / Info adicional: ${ticket.description}</p>
    <br></br>
    </div>
    `
  }

  await transporter.sendMail(data);

}

const validateUser = async (id) => {
    
    if(id === "asd")
    {
        return {
            id: "asd",
            address: "asd123",
            email: "asd123"
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

const addProps = (props) => {
    Object.assign(ticket, props);
}

module.exports = {sendEmail,validateUser,addProps}