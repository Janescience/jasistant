const express = require('express');
const bodyParser = require('body-parser')
// const cors = require("cors")
const path = require("path");
const fs = require("fs");

const errorHandler  = require('./src/middlewares/error-handler');

const dotenv = require('dotenv');
dotenv.config();
// Initialize Express App 
const app = express();
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({limit: '50mb', extended:true }))
app.use(express.static(path.join(__dirname, '/public')))
app.use(bodyParser.text())
// const whitelist = ['https://cow-app.vercel.app','https://dairy-farm-app.onrender.com','http://localhost:5173','http://localhost:4000'];
// const corsOption = {
//   origin: (origin, callback) => {
//     if(whitelist.indexOf(origin) !== -1 || !origin){
//       callback(null,true)
//     }else{
//       callback(new Error('Not allowed by CORS'))
//     }
//   },
//   optionsSuccessStatus : 200
// }

// Routes Setup  
require('./src/routes/webhook.routes')(app);
require('./src/routes/notification.routes')(app);

// basic route
app.get(["/","/index.html"],(req,res) => {
  res.sendFile(path.join(__dirname, 'views','index.html'));
})

app.all("*", (req,res) => {
  res.status(404);
  if(req.accepts('html')){
    res.sendFile(path.join(__dirname, 'views','404.html'));
  } else if (req.accepts('json')) {
    res.json({error : "404 Not Found"});
  }else {
    res.type('txt').send('404 Not Found')
  }
})

app.use(errorHandler)

app.listen(process.env.PORT, () => {
  // fs.writeFileSync('keys.json', JSON.stringify(Object.fromEntries(Object.entries(require('tweetnacl').box.keyPair()).map(x => [x[0], Buffer.from(x[1]).toString('base64')]))))
  console.log("Server is running on port : ",process.env.PORT);
})




