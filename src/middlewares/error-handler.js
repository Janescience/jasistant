const { logEvents } = require('./log-events');

const errorHandler = (err,req,res,next) => {
    logEvents(`${err.name} : ${err.message}`);
    console.error('Error handler : '+err);
    res.status(500).send(err);
}

module.exports = errorHandler;