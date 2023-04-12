const { addKeyword } = require('@bot-whatsapp/bot')

const {sendEmail} = require('./utils.js')
const {addProps} = require('./utils.js')
const {addAudio} = require('./utils.js')
const {addImage} = require('./utils.js')

let info = ""

const flujoConocido = addKeyword('1')
.addAnswer('Ingrese razon social',
{
    capture: true
},
(ctx) => {
    info = ""
    info = info + ctx.body;
    console.log(info)
})
.addAnswer('Ingrese domicilio',
{
    capture: true
},
(ctx) => {
    info = ""
    info = info + ctx.body;
    console.log(info)
})


module.exports = flujoConocido