
const { decodeRomanNumerals } =  require("./RomanNumerals")
const { recordExpense } = require("./ExpenseTracking")

const handleTextMessage = async (message) =>{
  message = message.trim()
  let match
  
  if (match = message.match(/^([\d.]+|[ivxlcdm]+)(j?)([tfghmol])([ ^a-zA-Z0-9])$/i)) {
    const m = match
    const enteredAmount = m[1].match(/[ivxlcdm]/)
      ? decodeRomanNumerals(m[1])
      : +m[1]
    const amount = enteredAmount.toFixed(2)
    const category = {
      t: "transportation",
      f: "food",
      g: "game",
      h: "health",
      m: "miscellaneous",
      o: "occasion",
      l: "lodging"
    }[m[3].toLowerCase()]
    const remarks = m[2] ? `${m[1]} THB` : ""
    const name = m[4] ? m[4] : ""
    console.log('name : ',name)
    return await recordExpense(amount, category, remarks)
  }
}

const handler = {
  handleTextMessage
};

module.exports = handler;