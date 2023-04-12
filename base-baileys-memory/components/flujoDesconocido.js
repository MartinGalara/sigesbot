const { addKeyword } = require('@bot-whatsapp/bot')

const {addProps} = require('./utils.js')

const flujoSiges = require('./flujoSiges.js')
const flujoImpresoraFiscal = require('./flujoImpresoraFiscal.js')
const flujoImpresoraComun = require('./flujoImpresoraComun.js')
const flujoDespachosCeo = require('./flujoDespachosCeo.js')
const flujoServidor = require('./flujoServidor.js')
const flujoLibroIva = require('./flujoLibroIva.js')
const flujoAplicaciones = require('./flujoAplicaciones.js')

const opcionesProblema = ['Sistema SIGES','Impresora fiscal','Impresora común','Despachos CEO','Servidor','Libro IVA','Aplicaciones']

const opciones = ['Indique el numero de la opción correspondiente al servicio en el que necesita soporte','1. Sistema SIGES','2. Impresora fiscal','3. Impresora común','4. Despachos CEO','5. Servidor','6. Libro IVA','7. Aplicaciones']

const objOpciones = {
    1: "Sistema SIGES",
    2: "Impresora fiscal",
    3: "Impresora común",
    4: "Despachos CEO",
    5: "Servidor",
    6: "Libro IVA",
    7: "Aplicaciones"
}

let info = ""

const flujoDesconocido = addKeyword('2')
.addAnswer('Ingrese razon social',
{
    capture: true
},
(ctx) => {
    info = ""
    info = info + ctx.body;
})
.addAnswer('Ingrese domicilio',
{
    capture: true
},
(ctx) => {
    info = info + " " + ctx.body;
    addProps({info: info})
})
.addAnswer('En que computadora / punto de venta necesita soporte ?',
{
    capture: true
},
(ctx) => {
    addProps({pf: ctx.body})
})
.addAnswer('Ingrese el ID de teamviewer. Si lo desconoce ingrese "0"',
{
    capture: true
},
(ctx) => {
    addProps({tv: ctx.body})
})
.addAnswer(opciones,
    {
        capture:true
    },
    (ctx, {endFlow}) => {
    
        const selected = ctx.body
        ctx.body = objOpciones[selected]
        if(!opcionesProblema.includes(ctx.body)) {
            console.log("entre al error")
            return endFlow({body: '❌ Respuesta invalida ❌ Escriba "Inicio" para volver a comenzar' 
            })
        }
        addProps({problem: ctx.body})
    },
    [flujoSiges,flujoImpresoraFiscal,flujoImpresoraComun,flujoDespachosCeo,flujoServidor,flujoLibroIva,flujoAplicaciones]
    )


module.exports = flujoDesconocido

//[flujoSiges,flujoImpresoraFiscal,flujoImpresoraComun,flujoDespachosCeo,flujoServidor,flujoLibroIva,flujoAplicaciones]