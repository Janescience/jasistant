
const { recordExpense } = require("./ExpenseTracking")

const handleTextMessage = async (message) =>{
  message = message.trim()
  let match
  
  if (match = message.match(/^([\d.]+|[ivxlcdm]+)([tfedcaghmol])([ \w]+|)$/i)) {
    const m = match
    const enteredAmount = +m[1]
    const amount = enteredAmount.toFixed(2)
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
    }[m[3].toLowerCase()]
    const name = m[4] ? m[4] : ""
    return await recordExpense(name,amount, category)
  }else{
    return 'The message does not match any conditions.'
  }
}

const handler = {
  handleTextMessage
};

module.exports = handler;