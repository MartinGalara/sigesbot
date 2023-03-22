const axios = require('axios')

const nodemailer = require("nodemailer")

const dotenv = require("dotenv");

dotenv.config();

let ticket = {}

const sendEmail = async () => {

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

const addProps = (props) => {
    Object.assign(ticket, props);
}

module.exports = {sendEmail,validateUser,addProps}