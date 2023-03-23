const axios = require('axios')

const nodemailer = require("nodemailer")

const dotenv = require("dotenv");

dotenv.config();

let ticket = {}

const fs = require('fs');

async function downloadFile(directPath, fileName) {
  const response = await axios({
    method: 'get',
    url: `https://mmg.whatsapp.net${directPath}`,
    responseType: 'arraybuffer'
  });
  
  fs.writeFileSync(fileName, response.data);
  console.log('Archivo descargado con éxito');
}

const asdasd = async () => {

    downloadFile(ticket.media.message.imageMessage.directPath,'asd.jpg')

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
        text: "Un cliente necesita soporte", // plain text body
        html: `
        <div>
        <p>Datos del ticket</p>
        <br></br>
        </div>
        `, // html body
      });

}

const sendEmailSiges = async () => {

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
        text: "Un cliente necesita soporte", // plain text body
        html: `
        <div>
        <p>Datos del ticket</p>
        <p>Soporte para: ${ticket.problem}</p>
        <p>Correo: ${ticket.email}</p>
        <p>Dirección: ${ticket.adress}</p>
        <p>ID de TeamViewer: ${ticket.idTV}</p>
        <p>Password de TeamViewer: ${ticket.passTV}</p>
        <p>Teléfono de contacto: ${ticket.phone}</p>
        <p>Punto de facturación / PC: ${ticket.pf}</p>
        <p>Descripción del problema: ${ticket.description}</p>
        <br></br>
        </div>
        `, // html body
      });

}

const sendEmailImpComun = async () => {

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
        text: "Un cliente necesita soporte", // plain text body
        html: `
        <div>
        <p>Datos del ticket</p>
        <p>Soporte para: ${ticket.problem}</p>
        <p>Correo: ${ticket.email}</p>
        <p>Dirección: ${ticket.adress}</p>
        <p>ID de TeamViewer: ${ticket.idTV}</p>
        <p>Password de TeamViewer: ${ticket.passTV}</p>
        <p>Teléfono de contacto: ${ticket.phone}</p>
        <p>Solicitud: ${ticket.type}</p>
        <p>Punto de facturación / PC: ${ticket.pf}</p>
        <p>Marca / Modelo: ${ticket.model}</p>
        <p>Se encuentra conectada ?: ${ticket.connected}</p>
        <p>Descripción / Info adicional: ${ticket.description}</p>
        <br></br>
        </div>
        `, // html body
      });

}

const sendEmailImpFiscal = async () => {

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
      text: "Un cliente necesita soporte", // plain text body
      html: `
      <div>
      <p>Datos del ticket</p>
      <p>Soporte para: ${ticket.problem}</p>
      <p>Correo: ${ticket.email}</p>
      <p>Dirección: ${ticket.adress}</p>
      <p>Teléfono de contacto: ${ticket.phone}</p>
      <p>ID de TeamViewer: ${ticket.idTV}</p>
      <p>Password de TeamViewer: ${ticket.passTV}</p>
      <p>Solicitud: ${ticket.type}</p>
      <p>Punto de facturación / PC: ${ticket.pf}</p>
      <p>Marca / Modelo: ${ticket.model}</p>
      <p>Se encuentra conectada / Tipo de conexión: ${ticket.connected}</p>
      <p>Descripción / Info adicional: ${ticket.description}</p>
      <br></br>
      </div>
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

const addProps = (props) => {
    Object.assign(ticket, props);
}

module.exports = {asdasd,sendEmailImpFiscal, sendEmailSiges, sendEmailImpComun,validateUser,addProps}