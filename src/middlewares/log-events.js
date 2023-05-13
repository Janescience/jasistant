const { format } = require('date-fns');
const { v4:uuid } = require('uuid');

const logEvents = async (message) => {
    const dateTime = `${format(new Date(),'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    try {
        // if(!fs.existsSync(path.join(__dirname,'../..',process.env.LOG_PATH))){
        //     await fsPromises.mkdir(path.join(__dirname,'../..',process.env.LOG_PATH));
        // }
        // await fsPromises.appendFile(path.join(__dirname,'../..',process.env.LOG_PATH,logName),logItem);
        console.log(logItem)
    } catch (error) {
        console.error(error);
    }
}

const logger = (req,res,next) => {
    if(req.body){
        // logEvents(`${req.method}\t${req.headers.origin}\t${req.url}\t${JSON.stringify(req.body)}`,'req-log.txt');
        console.log(`${req.method} ${req.path} ${JSON.stringify(req.body)}`);

    }else{
        // logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`,'req-log.txt');
        console.log(`${req.method} ${req.path}`);
    }
    next();
}

module.exports = { logger , logEvents};