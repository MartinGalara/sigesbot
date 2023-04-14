const { addKeyword } = require('@bot-whatsapp/bot')

const flujo3 = addKeyword('3')
.addAnswer('Este es el flujo 3',
{
    capture: true
},
(ctx,{fallBack,flowDynamic}) => {

    console.log("entre al flujo 3 paso 1")
    
})
.addAnswer('Segundo answer del flujo 3',
{
    capture: true
},
(ctx,{fallBack,flowDynamic}) => {
  
    console.log("entre al flujo 3 paso 2")

})

module.exports = flujo3