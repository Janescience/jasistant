const qrcode = require('qrcode')
const generatePayload = require('promptpay-qr')
const svgToDataURL = require('svg-to-dataurl')
const { createBubble } = require("./LineMessageUtility");

const generateQrcode = async (amount) => {

  const mobileNumber = '080-608-1559'
  const payload = generatePayload(mobileNumber, { amount })
  const options = { type: 'svg', color: { dark: '#003b6a', light: '#f7f8f7' } }

  const qr =  await new Promise((resolve, reject) => {
    qrcode.toString(payload, options, (err, svg) => {
      if (err) return reject(err)
         resolve(svg)
    })
  })
  const url = svgToDataURL(qr)
  return {
    type: "flex",
    contents:{
      type:"bubble",
      body:{
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "image",
            url: url,
            size: "md",
          },
          {
            type: "text",
            text: `${amount} บาท`,
            wrap: true,
          },
        ]
      }
    }
  }
  
}

module.exports = generateQrcode;
