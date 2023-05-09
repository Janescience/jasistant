
import { decodeRomanNumerals } from "./RomanNumerals"
import { recordExpense } from "./ExpenseTracking"

export async function handleTextMessage(message){
  message = message.trim()
  let match
  
  if ((match = message.match(/^([\d.]+|[ivxlcdm]+)(j?)([tfghmol])$/i))) {
    const m = match
    const enteredAmount = m[1].match(/[ivxlcdm]/)
      ? decodeRomanNumerals(m[1])
      : +m[1]
    const conversionRate = m[2] ? 0.302909 : 1
    const amount = (enteredAmount * conversionRate).toFixed(2)
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
    return await recordExpense(context, amount, category, remarks)
  }
}