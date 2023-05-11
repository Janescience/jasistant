const qrcode = require('qrcode')
const generatePayload = require('promptpay-qr')
const svgToDataURL = require('svg-to-dataurl')
const { createBubble } = require("./LineMessageUtility");

const generateQrcode = async (amount) => {

  const mobileNumber = '080-608-1559'
  const payload = generatePayload(mobileNumber, { amount })
  const options = { type: 'svg', color: { dark: '#003b6a', light: '#f7f8f7' } }
  
  // const imageUrl = 'data:image/svg+xml,<svg>...</svg>';
  const previewUrl = 'data:image/png;base64,iVBORw0KG...';
  
  const imageUrl =  await new Promise((resolve, reject) => {
    qrcode.toString(payload, options, (err, svg) => {
      if (err) return reject(err)
         resolve(svg)
    })
  })
  
  const previewUrl =  await qrcode.toDataURL(payload)


  const message = {
    type: 'image',
    originalContentUrl: imageUrl,
    previewImageUrl: previewUrl
  };


  // const urls = svgToDataURL(qr)
  return {
    "type": "image",
    "originalContentUrl": qr,
    "previewImageUrl": qr
  }
}

module.exports = generateQrcode;
