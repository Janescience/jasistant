
const expenseTracking = require("../modules/expense-tracking.module")
const qrcodePromptpay = require("../modules/qrcode-promptpay.module")

const category = {
  t: "transportation",
  f: "food",
  e: "electronic",
  d: "drinks",
  c: "clothes",
  a: "alcohal",
  g: "game",
  h: "health",
  m: "miscellaneous",
  o: "occasion",
  l: "lodging"
}

const messageService = async (message) =>{
    message = message.trim()
    let match
    
    if (match = message.match(/^([\d.]+|[ivxlcdm]+)([tfedcaghmol])([ \w]+|)$/i)) {
      const m = match
      
      const enteredAmount = +m[1]
      const amount = enteredAmount.toFixed(2)
      const ctg = category[m[2].toLowerCase()]
      const name = m[3] ? m[3] : ""

      return await expenseTracking(null,name,amount, ctg)
    }else if(match = message.match(/^(expctg)$/i)){
      return {message :  JSON.stringify(category,null,4) }
    }else if(match = message.match(/^(qr)([\d.]+)$/i)){
      const amount = Number(match[2])
      return await qrcodePromptpay(amount)
    }
}

module.exports = messageService;