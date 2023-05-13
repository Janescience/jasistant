const config = require("../config/line.config");
const messageService = require("../services/message.service");
const imageService = require("../services/image.service");

const { Client } =  require('@line/bot-sdk')
const { toMessages,readAsBuffer } = require('../utilities/line.utility')

exports.webhook = async (req, res) => {
    const client = new Client(config())
    const events = req.body.events;
    let data;
    for (const event of events) {
      if (event.type === "message") {
        data = await messageEvent(event,client)
      }
    }
    return data;
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