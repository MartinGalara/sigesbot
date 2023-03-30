const axios = require('axios')

const nodemailer = require("nodemailer")

const dotenv = require("dotenv");

const { downloadMediaMessage } = require('@adiwajshing/baileys')

dotenv.config();

let ticket = {}

const sendEmail = async () => {

  console.log(ticket)

  const newTicket = await createTicket(ticket.id)

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SENDER, // generated ethereal user
      pass: process.env.GMAIL_PASS, // generated ethereal password
    },
  });

  let data = {
    from: `"WT ${newTicket.id}" <${process.env.SENDER}>`, // sender address
    to: process.env.RECIEVER, // list of receivers
    subject: `${newTicket.userId} necesita soporte`, // Subject line
    text: `${newTicket.userId} necesita soporte`, // plain text body
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
    <p>Dirección: ${ticket.info}</p>
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
    <p>Dirección: ${ticket.info}</p>
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

  const mail = await transporter.sendMail(data);

  //console.log(mail)

}

const validateUser = async (id) => {

  const config = {
    method: 'get',
    url: `${process.env.SERVER_URL}/users?id=${id}`,
}

  const user = await axios(config)

  if(user.data.lenth !== 0){
    ticket.email = user.data[0].email
    ticket.info = user.data[0].info
    return user.data[0]
  }
  else{
    return false
  }
}

const addProps = (props) => {
    Object.assign(ticket, props);
}

const createTicket = async (userId) => {

  const config = {
    method: 'post',
    url: `${process.env.SERVER_URL}/tickets`,
    data:{
      userId: userId
    }
  }

  const ticket = await axios(config)

  return ticket.data

}

module.exports = {sendEmail,validateUser,addProps}