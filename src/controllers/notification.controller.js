const sealedbox = require('tweetnacl-sealedbox-js');

exports.notification = async (req, res) => {
    const result = sealedbox.open(
      Buffer.from(req.body, 'hex'),
      Buffer.from(process.env.NOTI_PUBLIC_KEY, 'base64'),
      Buffer.from(process.env.NOTI_SECRET_KEY, 'base64')
    );
    
    console.log(Buffer.from(result).toString());
};