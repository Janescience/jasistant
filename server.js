const path = require("path");
const axios = require("axios");
const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN
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
fastify.post("/webhook", async function (request, reply) {
  if(request.query.apiKey !== process.env.API_KEY){
    console.warn('request is not from line.')
    return 'Request is not from LINE!!'
  }
  for(const event of request.body.events){
    if(event.type === 'message'){
      await handleMessageEvent(event);
    }
  }
  return 'ok';
});

async function handleMessageEvent(event){
  const { replyToken, message } = event
  if(event.source.userId !== process.env.LINE_USER_ID){
    console.warn('receive message ifrom unkown user')
    return
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
