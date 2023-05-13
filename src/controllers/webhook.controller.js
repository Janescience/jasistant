const lineConfig = require("../config/line.config");
const messageService = require("../services/message.service");
const imageService = require("../services/image.service");

const { Client } =  require('@line/bot-sdk')
const { toMessages,readAsBuffer } = require('../utilities/line.utility')

exports.webhook = async (req, res) => {
    const client = new Client(lineConfig())
    console.info(
        { ingest: "line", event: JSON.stringify(req.body) },
        "Received webhook from LINE"
      )
      const events = req.body.events;
      for (const event of events) {
        if (event.type === "message") {
          return await messageEvent(event,client)
        }
      }
}

const messageEvent = async (event,client) => {
    const { replyToken, message } = event
    
    if(event.source.userId !== process.env.LINE_USER_ID){
        await client.replyMessage(replyToken,toMessages('unauthorized'))
        return 
    }

    if (message.type === 'text') {

        const reply = await messageService(message.text)
        console.log(reply)
        await client.replyMessage(replyToken,toMessages(reply))

    }else if (message.type === 'image') {

        const content = await client.getMessageContent(message.id)
        const buffer = await readAsBuffer(content)
        const reply = await imageService(buffer)

        await client.replyMessage(replyToken, toMessages(reply))
    }
  
}