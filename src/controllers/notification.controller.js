const sealedbox = require('tweetnacl-sealedbox-js');
const keys = require('./keys.json')

exports.notification = async (req, res) => {
    const result = sealedbox.open(
      Buffer.from(req.body, 'hex'),
      Buffer.from(keys.publicKey, 'base64'),
      Buffer.from(keys.secretKey, 'base64')
    );
    
    console.log(Buffer.from(result).toString());
};