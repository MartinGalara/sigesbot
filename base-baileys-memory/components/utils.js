const axios = require('axios')

const nodemailer = require("nodemailer")

const dotenv = require("dotenv");

const { downloadMediaMessage } = require('@adiwajshing/baileys')

dotenv.config();

let ticket = {}

let mailAttachments = []

const sendEmail = async () => {

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
    subject: `${ticket.info} | Soporte para ${ticket.problem} | ${ticket.pf}`, // Subject line
    text: `${ticket.info} | Soporte para ${ticket.problem} | ${ticket.pf}`, // plain text body
  }

  if(mailAttachments.length !== 0){
    data.attachments = mailAttachments;
  }

  if(ticket.problem === "Sistema SIGES"){
    data.html = `
    <div>
    <p>Datos del ticket</p>
    <p>Soporte para: ${ticket.problem}</p>
    <p>ID Cliente: ${ticket.id}</p>
    <p>Info Cliente: ${ticket.info}</p>
    <p>Correo: ${ticket.email}</p>
    <p>Teléfono que genero el ticket: ${ticket.phone}</p>
    <p>Punto de facturación / PC: ${ticket.pf}</p>
    <p>ID TeamViewer: ${ticket.tv}</p>
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
    <p>Info Cliente: ${ticket.info}</p>
    <p>Correo: ${ticket.email}</p>
    <p>Teléfono que genero el ticket: ${ticket.phone}</p>
    <p>Solicitud: ${ticket.type}</p>
    <p>Punto de facturación / PC: ${ticket.pf}</p>
    <p>ID TeamViewer: ${ticket.tv}</p>
    <p>Marca / Modelo: ${ticket.model}</p>
    <p>Se encuentra conectada / Tipo de conexión: ${ticket.connected}</p>
    <p>Descripción / Info adicional: ${ticket.description}</p>
    <br></br>
    </div>
    `
  }

  const mail = await transporter.sendMail(data);

  return newTicket.id

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

const computers = async (userId) => {
  
  const config = {
    method: 'get',
    url: `${process.env.SERVER_URL}/computers?userId=${userId}`,
  }

  const computers = await axios(config).then((i) => i.data)

  ticket.computers = []
  computers.map( e=> {
    ticket.computers.push(e)
  })

}

const computerOptions = async () => {

  const array = []

  let i = 1;

  ticket.computers.map(e => {
    array.push({
      body: `${i} - ${e.alias}`
    })
    i++;
  })

  return array;

}

const computerInfo = (option) => {

  if(ticket.computers[option-1] && option !== "0"){
    ticket.pf = ticket.computers[option-1].alias
    ticket.tv = ticket.computers[option-1].teamviewer_id
  }
  else{
    console.log("entre aca")
  }

}

const addAudio = async (ctx) => {

  const buffer = await downloadMediaMessage(ctx,'buffer')

  const audio = {
    filename: 'adjunto.mp3',
    content: Buffer.from(buffer, 'base64')
  }
  mailAttachments.push(audio)

}

const addImage = async (ctx) => {

  const buffer = await downloadMediaMessage(ctx,'buffer')

    const image = {
      filename: 'adjunto.jpg',
      content: Buffer.from(buffer, 'base64')
    }
    mailAttachments.push(image)
}


module.exports = {sendEmail,validateUser,addProps,computers,computerOptions,computerInfo,addAudio,addImage}