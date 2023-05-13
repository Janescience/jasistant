const dotenv = require('dotenv');
dotenv.config();

const config = () => {
    return { 
        channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
        channelSecret: process.env.LINE_CHANNEL_SECRET
    }
}

module.exports = config