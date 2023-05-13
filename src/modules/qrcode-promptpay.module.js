const qrcode = require('qrcode')
const generatePayload = require('promptpay-qr')

const generateQrcode = async (amount) => {

  const mobileNumber = '080-608-1559'
  const payload = generatePayload(mobileNumber, { amount })
  
  const options = { type: 'svg', color: { dark: '#000', light: '#fff' } }
  
  const qrSvg = await qrcode.toString(payload, options,async (err, svg) => {
      if (err) return console.log(err)
        return svg;
  })

  const message = {
    type: 'image',
    originalContentUrl: qrSvg,
    previewImageUrl: qrSvg
  };

  return message;
}

module.exports = generateQrcode;
