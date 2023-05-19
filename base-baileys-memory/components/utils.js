const axios = require('axios')
const nodemailer = require("nodemailer")
const dotenv = require("dotenv");
const { downloadMediaMessage } = require('@adiwajshing/baileys')
const { writeFile } = require('fs/promises')

dotenv.config();

let ticket = {}

const sendEmail = async (from) => {

  const newTicket = await createTicket(ticket[from].userId)

  await getStaff(from)

  let reciever = ""
  if(ticket[from].userId === "YPtest"){
    reciever = process.env.TESTINGMAIL
  }else{
    reciever = process.env.RECIEVER
  }

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SENDER, // generated ethereal user
      pass: process.env.GMAIL_PASS, // generated ethereal password
    },
  });

  let replyTo = ticket[from].staff.mails.join(', ')

  if(ticket[from].vipmail){
    if(replyTo === ''){
      replyTo = ticket[from].vipmail
    }else{
      replyTo = replyTo + ', ' + ticket[from].vipmail
    }
  }

  let data = {
    from: `"WT ${newTicket.id}" <${process.env.SENDER}>`, // sender address
    to: reciever, // list of receivers
    cc: replyTo,
    subject: `WT ${newTicket.id} | ${ticket[from].info} | Soporte para ${ticket[from].problem} | ${ticket[from].pf}`, // Subject line
    text: `WT ${newTicket.id} | ${ticket[from].info} | Soporte para ${ticket[from].problem} | ${ticket[from].pf}`, // plain text body
    replyTo: replyTo
  }

  if(ticket[from].mailAttachments && ticket[from].mailAttachments.length !== 0){
    data.attachments = ticket[from].mailAttachments;
  }

  if(ticket[from].problem === "Despachos CIO" || ticket[from].problem === 'Servidor'){
    data.html = `
    <div>
    <p>Datos del ticket</p>
    <p>Soporte para: ${ticket[from].problem}</p>
    <p>ID Cliente: ${ticket[from].userId}</p>
    <p>Info Cliente: ${ticket[from].info}</p>
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
    <p>ID Cliente: ${ticket[from].userId}</p>
    <p>Info Cliente: ${ticket[from].info}</p>
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
    <p>ID Cliente: ${ticket[from].userId}</p>
    <p>Info Cliente: ${ticket[from].info}</p>
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
    <p>ID Cliente: ${ticket[from].userId}</p>
    <p>Info Cliente: ${ticket[from].info}</p>
    <p>Teléfono que genero el ticket: ${ticket[from].phone}</p>
    <p>Solicitud: ${ticket[from].type}</p>
    <p>Punto de facturación / PC: ${ticket[from].pf}</p>
    <p>ID TeamViewer: ${ticket[from].tv}</p>
    <p>Descripción / Info adicional: ${ticket[from].description}</p>
    <p>Urgencia indicada por el cliente: ${ticket[from].priority}</p>
    <br></br>
    <p>Para generar un ticket de operador: ${process.env.URL_OPTICKET}</p>
    </div>
    `
  }

  const mail = await transporter.sendMail(data);

  console.log(data.subject)

  console.log(ticket)

  // Función para agregar un retraso de 5 segundos
  function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Llamada a la función con retraso
  await delay(5000);

  const id = await getTicketId(data.subject)

  if(id) return id
  else return newTicket.id

}

const validateUser = async (from,id) => {

const fullId = ticket[from].bandera + id

addProps(from,{userId: fullId})

  const config = {
    method: 'get',
    url: `${process.env.SERVER_URL}/users?id=${fullId}`,
}

  const user = await axios(config)

  if(user.data.length !== 0){
    ticket[from].info = user.data[0].info
    ticket[from].vip = user.data[0].vip
    ticket[from].vipmail = user.data[0].vipmail
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

const computers = async (from) => {
  
  const config = {
    method: 'get',
    url: `${process.env.SERVER_URL}/computers?userId=${ticket[from].userId}&zone=${ticket[from].zone}`,
  }

  const computers = await axios(config).then((i) => i.data)

  const hasOrder = computers.some((computer) => computer.order !== null);

  if(hasOrder){
    computers.sort((a, b) => a.order - b.order);
  }else{
    computers.sort((a, b) => {
      if (a.alias < b.alias) return -1;
      if (a.alias > b.alias) return 1;
      return 0;
    });
  }

  ticket[from].computers = []
  computers.map( e=> {
    ticket[from].computers.push(e)
  })

}

const computerOptions = (from) => {

  if(ticket[from].id !== "No brinda identificador"){

    if(ticket[from].computers.length === 0) return ['No se encontraron puestos de trabajo registrados en esta zona','Envie 0 para continuar']

    const array = ['Elija el número del puesto de trabajo donde necesita soporte','Si no lo sabe o ninguno es correcto, envíe "0"']

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
    const array = ['En un solo mensaje, indique en que estacion / shop y en que puesto de trabajo necesita soporte']

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


const sendMessage = async (from,provider,ticketId) => {

  let prov = provider.getInstance()

  let zone = ""

  switch(ticket[from].zone){
    case "P":
      zone = "Playa"
      break;
      
    case "B":
      zone = "Boxes"
      break;

    case "A":
      zone = "Administracion"
      break;

    case "T":
      zone = "Tienda"
      break;
  }

  const today = new Date();
  const dayOfWeek = today.getDay();
  const hourOfDay = today.getHours();
  const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6 || (dayOfWeek === 5 && hourOfDay >= 20) || (dayOfWeek === 1 && hourOfDay < 6));

  if (isWeekend) {
    const telefono = process.env.GUARDIA + '@s.whatsapp.net'
    await prov.sendMessage(telefono,{text:`WT: ${ticketId} - El cliente ${ticket[from].info} genero un ticket pidiendo soporte para ${zone} - ${ticket[from].problem}. Nivel de urgencia: ${ticket[from].priority}`})
  }

  if(!ticket[from].unknown && ticket[from].vip){
      
    await prov.sendMessage(`${from}@s.whatsapp.net`,{text:`Tu ejecutivo de cuenta ya fue notificado del problema`})

    const telefono = ticket[from].vip
    await prov.sendMessage(telefono,{text:`El cliente ${ticket[from].info} genero un ticket pidiendo soporte para ${zone} - ${ticket[from].problem}. Nivel de urgencia: ${ticket[from].priority}`})
  }

  for (let i = 0; i < ticket[from].staff.phones.length; i++) {
    
    if(ticket[from].staff.phones[i]){
    await prov.sendMessage(ticket[from].staff.phones[i],{text:`Se genero un ticket pidiendo soporte para ${zone} - ${ticket[from].problem}. Nivel de urgencia: ${ticket[from].priority}`})
    }

  }

  delete ticket[from]

}

const isUnknown = (from) => {
  return ticket[from].unknown
}

const getBandera = (from) => {

  switch (ticket[from].bandera){

        case "YP": 
            return [{body: "Ingrese su numero de APIES"}]

        case "SH": 
            return [{body: "Ingrese su numero de identificacion SHELL"}]

        case "AX": 
            return [{body: "Ingrese su numero de identificacion AXION"}]

        case "PU": 
            return [{body: "Ingrese su numero de identificacion PUMA"}]

        case "GU": 
           return [{body: "Ingrese su numero de identificacion GULF"}]

        case "RE": 
            return [{body: "Ingrese su numero de identificacion REFINOR"}]

        case "BL": 
            return [{body: "Ingrese su numero de identificacion"}]

        case "OT": 
            return [{body: "Ingrese su numero de identificacion"}]

        default:
          return

  }

}

const tvInDb = (from) => {
  if(ticket[from].tv === "Consultar al cliente tv e indentificador de PC y reportarlo"){
    return false
  }else{
    return true
  }
}

const getStaff = async (from) => {

  const config = {
    method: 'get',
    url: `${process.env.SERVER_URL}/staffs?userId=${ticket[from].userId}`,
  }

  const staff = await axios(config).then((i) => i.data)

  ticket[from].staff = {}
  ticket[from].staff.mails = []
  ticket[from].staff.phones = []

  const mails = []
  const phones = []

  staff.map( e => {
    if(e.zone === null || e.zone === ticket[from].zone) {
      mails.push(e.email)
      phones.push(e.phone)
    }
  })

  ticket[from].staff.mails = mails
  ticket[from].staff.phones = phones
  
}

const testing = async (ctx) => {

  const attachments = ["path1", "path2", "path3"]; // Array con las rutas de los archivos adjuntos

  var unirest = require('unirest');
  var fs = require('fs');
  const path = './LALALA.jpeg';

  const buffer = await downloadMediaMessage(ctx, 'buffer');
  await writeFile(path, buffer);

  await new Promise((resolve, reject) => {
    

    var API_KEY = "lEAbWQZEmU4UfZ9D6ug";
    var FD_ENDPOINT = "sistemasiges";

    var PATH = "/api/v2/tickets";
    var enocoding_method = "base64";
    var auth = "Basic " + new Buffer(API_KEY + ":" + 'X').toString(enocoding_method);
    var URL = "https://" + FD_ENDPOINT + ".freshdesk.com" + PATH;

    var fields = {
      email: 'mgalara@gmail.com',
      subject: 'Ticket subject',
      type: 'Incidente',
      'custom_fields[cf_recibido_por]': 'Bot'
    };

    fields.description = "Lalala"

    var headers = {
      'Authorization': auth
    };

    unirest.post(URL)
      .headers(headers)
      .field(fields)
      .attach('attachments[]', fs.createReadStream(path))
      .end(function (response) {
        console.log(response.body);
        console.log("Response Status : " + response.status);
        if (response.status == 201) {
          console.log("Location Header : " + response.headers['location']);
        } else {
          console.log("X-Request-Id :" + response.headers['x-request-id']);
        }
        resolve(); // Resuelve la promesa después de que se haya ejecutado el código anterior
      });
  });

  fs.unlink(path, (err) => {
    if (err) {
      console.error('Error al eliminar el archivo:', err);
      return;
    }

    console.log('Archivo eliminado:', path);
  });
};


module.exports = {testing,tvInDb,getBandera,isUnknown,sendEmail,validateUser,addProps,computers,computerOptions,computerInfo,addAudio,addImage,deleteTicketData,sendMessage}