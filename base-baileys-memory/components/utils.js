const axios = require('axios')
const nodemailer = require("nodemailer")
const dotenv = require("dotenv");
const { downloadMediaMessage } = require('@adiwajshing/baileys')

dotenv.config();

let ticket = {}

const sendEmail = async (from) => {

  const newTicket = await createTicket(ticket[from].id)

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
    subject: `${ticket[from].info} | Soporte para ${ticket[from].problem} | ${ticket[from].pf}`, // Subject line
    text: `${ticket[from].info} | Soporte para ${ticket[from].problem} | ${ticket[from].pf}`, // plain text body
  }

  if(ticket[from].mailAttachments && ticket[from].mailAttachments.length !== 0){
    data.attachments = ticket[from].mailAttachments;
  }

  if(ticket[from].problem === "Despachos CIO" || ticket[from].problem === 'Servidor'){
    data.html = `
    <div>
    <p>Datos del ticket</p>
    <p>Soporte para: ${ticket[from].problem}</p>
    <p>ID Cliente: ${ticket[from].id}</p>
    <p>Info Cliente: ${ticket[from].info}</p>
    <p>Correo: ${ticket[from].email}</p>
    <p>Teléfono que genero el ticket: ${ticket[from].phone}</p>
    <p>Punto de facturación / PC: ${ticket[from].pf}</p>
    <p>ID TeamViewer: ${ticket[from].tv}</p>
    <p>Descripción del problema: ${ticket[from].description}</p>
    <p>Urgencia indicada por el cliente: ${ticket[from].priority}</p>
    <br></br>
    <p>Para generar un ticket de operador: ${process.env.URL_OPTICKET}</p>
    </div>
    ` // html body
  }else if(ticket[from].problem === "Sistema SIGES" || ticket[from].problem === 'Aplicaciones'){
    data.html = `
    <div>
    <p>Datos del ticket</p>
    <p>Soporte para: ${ticket[from].problem}</p>
    <p>ID Cliente: ${ticket[from].id}</p>
    <p>Info Cliente: ${ticket[from].info}</p>
    <p>Correo: ${ticket[from].email}</p>
    <p>Teléfono que genero el ticket: ${ticket[from].phone}</p>
    <p>Punto de facturación / PC: ${ticket[from].pf}</p>
    <p>ID TeamViewer: ${ticket[from].tv}</p>
    <p>Origen del problema: ${ticket[from].type}</p>
    <p>Descripción del problema: ${ticket[from].description}</p>
    <p>Urgencia indicada por el cliente: ${ticket[from].priority}</p>
    <br></br>
    <p>Para generar un ticket de operador: ${process.env.URL_OPTICKET}</p>
    </div>
    ` // html body
  }else if(ticket[from].problem === "Libro IVA"){
    data.html = `
    <div>
    <p>Datos del ticket</p>
    <p>Soporte para: ${ticket[from].problem}</p>
    <p>ID Cliente: ${ticket[from].id}</p>
    <p>Info Cliente: ${ticket[from].info}</p>
    <p>Correo: ${ticket[from].email}</p>
    <p>Teléfono que genero el ticket: ${ticket[from].phone}</p>
    <p>Solicitud: ${ticket[from].type}</p>
    <p>Período: ${ticket[from].timeFrame}</p>
    <p>Punto de facturación / PC: ${ticket[from].pf}</p>
    <p>ID TeamViewer: ${ticket[from].tv}</p>
    <p>Descripción / Info adicional: ${ticket[from].description}</p>
    <p>Urgencia indicada por el cliente: ${ticket[from].priority}</p>
    <br></br>
    <p>Para generar un ticket de operador: ${process.env.URL_OPTICKET}</p>
    </div>
    `
  }
  else{
    data.html = `
    <div>
    <p>Datos del ticket</p>
    <p>Soporte para: ${ticket[from].problem}</p>
    <p>ID Cliente: ${ticket[from].id}</p>
    <p>Info Cliente: ${ticket[from].info}</p>
    <p>Correo: ${ticket[from].email}</p>
    <p>Teléfono que genero el ticket: ${ticket[from].phone}</p>
    <p>Solicitud: ${ticket[from].type}</p>
    <p>Punto de facturación / PC: ${ticket[from].pf}</p>
    <p>ID TeamViewer: ${ticket[from].tv}</p>
    <p>Marca / Modelo: ${ticket[from].model}</p>
    <p>Se encuentra conectada / Tipo de conexión: ${ticket[from].connected}</p>
    <p>Descripción / Info adicional: ${ticket[from].description}</p>
    <p>Urgencia indicada por el cliente: ${ticket[from].priority}</p>
    <br></br>
    <p>Para generar un ticket de operador: ${process.env.URL_OPTICKET}</p>
    </div>
    `
  }

  const mail = await transporter.sendMail(data);

  return newTicket.id

  //console.log(mail)

}

const validateUser = async (from,id) => {

  const config = {
    method: 'get',
    url: `${process.env.SERVER_URL}/users?id=${id}`,
}

  const user = await axios(config)

  if(user.data.length !== 0){
    ticket[from].email = user.data[0].email
    ticket[from].info = user.data[0].info
    ticket[from].vip = user.data[0].vip
    return user.data[0]
  }
  else{
    return false
  }
}

const addProps = (from,props) => {
  if(ticket.hasOwnProperty(from)){
    Object.assign(ticket[from], props);
  }
  else{
    ticket[from] = {}
    Object.assign(ticket[from], props);
  }
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

const computers = async (from,userId) => {
  
  const config = {
    method: 'get',
    url: `${process.env.SERVER_URL}/computers?userId=${userId}`,
  }

  const computers = await axios(config).then((i) => i.data)

  ticket[from].computers = []
  computers.map( e=> {
    ticket[from].computers.push(e)
  })

}

const computerOptions = (from) => {

  if(ticket[from].id !== "No brinda identificador"){

    const array = ['Indique el numero de la opcion que corresponda a la computadora que necesita soporte o punto de venta','Si ninguna es correcta coloque el numero 0']

    let i = 1;
  
    ticket[from].computers.map(e => {
      array.push({
        body: `${i} - ${e.alias}`
      })
      i++;
    })
  
    return array;
  }
  else{
    const array = ['En un solo mensaje, indique en que estacion / shop y en que computadora esta el problema']

    return array;
  }

 

}

const computerInfo = (from,option) => {

  if(ticket[from].computers[option-1] && option !== "0"){
    ticket[from].pf = ticket[from].computers[option-1].alias
    ticket[from].tv = ticket[from].computers[option-1].teamviewer_id
  }

}

const addAudio = async (from,ctx) => {

  if(!ticket[from].hasOwnProperty("mailAttachments")){
    ticket[from].mailAttachments = []
  }

  const buffer = await downloadMediaMessage(ctx,'buffer')

  const audio = {
    filename: 'adjunto.mp3',
    content: Buffer.from(buffer, 'base64')
  }
  ticket[from].mailAttachments.push(audio)

}

const addImage = async (from,ctx) => {

  if(!ticket[from].hasOwnProperty("mailAttachments")){
    ticket[from].mailAttachments = []
  }

  const buffer = await downloadMediaMessage(ctx,'buffer')

    const image = {
      filename: 'adjunto.jpg',
      content: Buffer.from(buffer, 'base64')
    }
    ticket[from].mailAttachments.push(image)
}

const deleteTicketData = (from) => {
  ticket[from] = {}
}


const sendMessage = async (from,provider) => {

    if(!ticket[from].unknown && ticket[from].vip){
      const telefono = ticket[from].vip
      const prov = provider.getInstance()
      await prov.sendMessage(telefono,{text:`El cliente ${ticket[from].info} genero un ticket pidiendo soporte para ${ticket[from].problem}`})
    }

  delete ticket[from]

}

const isUnknown = (from) => {
  return ticket[from].unknown
}


module.exports = {isUnknown,sendEmail,validateUser,addProps,computers,computerOptions,computerInfo,addAudio,addImage,deleteTicketData,sendMessage}