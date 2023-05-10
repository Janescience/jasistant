const path = require("path");
const axios = require("axios");

const { handleTextMessage } = require('./src/MessageHandler')
const { toMessages } = require('./src/LineMessageUtility')

const { Client } =  require('@line/bot-sdk')

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // set this to true for detailed logging:
  logger: true,
});

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// fastify-formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// point-of-view is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

// Our main GET home page route, pulls from src/pages/index.hbs
fastify.get("/", function (request, reply) {
  // params is an object we'll pass to our handlebars template
  let params = {
    greeting: "Hello Node!",
  };
  // request.query.paramName <-- a querystring example
  return reply.view("/src/pages/index.hbs", params);
});

// A POST route to handle form submissions
fastify.post("/webhook", async (req, res) => {
    const lineConfig = getLineConfig(req, res)
    const lineClient = new Client(lineConfig)
    console.info(
      { ingest: "line", event: JSON.stringify(req.body) },
      "Received webhook from LINE"
    )
    const data = await handleWebhook(req.body.events, lineClient)
    return data
});

async function handleWebhook(events, client) {
  for (const event of events) {
    if (event.type === "message") {
      await handleMessageEvent(event,client)
    }
  }
}

async function handleMessageEvent(event,client){
  const { replyToken, message } = event
  try{
    if(event.source.userId !== process.env.LINE_USER_ID){
      await client.replyMessage(replyToken,toMessages('unauthorized'))
      return 
    }

    if (message.type === 'text') {
        const reply = await handleTextMessage(message.text)
        console.log('reply : ',reply)
        await client.replyMessage(replyToken, toMessages(reply))
    }
  }catch(error){
    await client.replyMessage(replyToken, toMessages(error))
  }
}

function getLineConfig(req, res) {
  return {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
  }
}

// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
