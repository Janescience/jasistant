const qrcode = require('qrcode')
const generatePayload = require('promptpay-qr')
const fs = require('fs') 
const { createBubble } = require("./LineMessageUtility");

const generateQrcode = async (amount) => {

  const mobileNumber = '080-608-1559'
  const payload = generatePayload(mobileNumber, { amount })
  
  const options = { type: 'svg', color: { dark: '#000', light: '#fff' } }
  
  qrcode.toString(payload, options, (err, svg) => {
      if (err) return console.log(err)
      fs.writeFileSync('./qr.svg', svg)
      console.log(svg)
  })

//   const message = {
//     type: 'image',
//     originalContentUrl: encodeURIComponent(imageUrl),
//     previewImageUrl: encodeURIComponent(previewUrl)
//   };

  // const urls = svgToDataURL(qr)
  // return message;
  return 
}

module.exports = generateQrcode;
