
const { recordExpense } = require("./ExpenseTracking")
const { putBlob } = require("./TemporaryBlobStorage")
const { ImageMessageHandler } = require("./ImageMessageHandler")

const messageHandlers = [
  ImageMessageHandler,
]

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
    }[m[2].toLowerCase()]
    const name = m[3] ? m[3] : ""
    if(category){
      return await recordExpense(name,amount, category)
    }else{
      return 'Category not found.'
    }
  }else if(){
    
  }
  
  // Go through message handlers and see if any of them can handle the message
  for (const handler of messageHandlers) {
    const action = handler(message)
    if (action) {
      return action()
    }
  }
}

const handleImage = async (imageBuffer) => {
  const blobName = await putBlob(imageBuffer, ".jpg")
  return await handleTextMessage("image:" + blobName)
}

const handler = {
  handleTextMessage,
  handleImage
};

module.exports = handler;