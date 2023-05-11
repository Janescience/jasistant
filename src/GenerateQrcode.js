const qrcode = require('qrcode')
const generatePayload = require('promptpay-qr')

export const generateQrcode = async (amount) => {


const mobileNumber = '080-608-1559'
const payload = generatePayload(mobileNumber, { amount })
const options = { type: 'svg', color: { dark: '#003b6a', light: '#f7f8f7' } }

await new Promise((resolve, reject) => {
  qrcode.toString(payload, options, (err, svg) => {
    if (err) return reject(err)
    resolve(svg)
  })
})
  
}
