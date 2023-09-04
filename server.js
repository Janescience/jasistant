const express = require('express');
const bodyParser = require('body-parser')
const path = require("path");

const errorHandler  = require('./src/middlewares/error-handler');

const dotenv = require('dotenv');
dotenv.config();

// Initialize Express App 
const app = express();
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({limit: '50mb', extended:true }))
app.use(express.static(path.join(__dirname, '/public')))
app.use(bodyParser.text())

// Routes Setup  
require('./src/routes/webhook.routes')(app);
require('./src/routes/notification.routes')(app);

// Basic route
app.get(["/","/index.html"],(req,res) => {
  res.sendFile(path.join(__dirname, 'views','index.html'));
})

// Not found route
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

//Error handle
app.use(errorHandler)

//When app start
app.listen(process.env.PORT, () => {
  console.log("Server is running on port : ",process.env.PORT);
})




