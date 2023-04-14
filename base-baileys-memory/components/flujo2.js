const { addKeyword } = require('@bot-whatsapp/bot')
const flujo3 = require('./flujo3.js')
const { sendMessage } = require('./utils.js')

const flujo2 = addKeyword('2')
.addAnswer('Este es el flujo 2',
{
    capture: true
},
async (ctx,{provider,gotoFlow}) => {
   
    /* const telefono = "asd@s.whatsapp.net"
    const prov = provider.getInstance()
    await prov.sendMessage(telefono,{text:"prueba"}) */
    console.log("entre al flujo 2")
    //sendMessage()
    gotoFlow(flujo3)
    
})

module.exports = flujo2