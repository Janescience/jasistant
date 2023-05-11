const qrcode = require('qrcode')
const generatePayload = require('promptpay-qr')
const svgToDataURL = require('svg-to-dataurl')
const { createBubble } = require("./LineMessageUtility");

const generateQrcode = async (amount) => {

  const mobileNumber = '080-608-1559'
  const payload = generatePayload(mobileNumber, { amount })
  const options = { type: 'svg', color: { dark: '#003b6a', light: '#f7f8f7' } }
  
  // const imageUrl = 'data:image/svg+xml,<svg>...</svg>';
  // const previewUrl = 'data:image/png;base64,iVBORw0KG...';
  
  const qrSvg =  await qrcode.toString(payload, options)
  const imageUrl = svgToDataURL(qrSvg);
  
  const previewUrl =  await qrcode.toDataURL(payload)

  const message = {
    type: 'image',
    originalContentUrl: encodeURIComponent(imageUrl),
    previewImageUrl: encodeURIComponent(previewUrl)
  };

  // const urls = svgToDataURL(qr)
  return message;
}

module.exports = generateQrcode;
