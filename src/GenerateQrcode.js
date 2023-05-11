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
  const body = {
    type: "box",
    layout: "horizontal",
    contents: [
      {
        type: "image",
        url: url,
        size: "md",
      }
    ],
    action: {
      type: "uri",
      label: "Open Airtable",
      uri: process.env.AIRTABLE_EXPENSE_URI,
    },
  };
  const bubble = createBubble("Expense Tracking", body, {
    headerColor: "#ffffbb"
  });
  return bubble;
  // return {
  //   type: "flex",
  //   contents:{
  //     type:"bubble",
  //     body:{
  //       type: "box",
  //       layout: "horizontal",
  //       contents: [
  //         {
  //           type: "image",
  //           url: "https://example.com/flex/images/image.jpg",
  //           size: "md",
  //         }
  //       ]
  //     }
  //   }
  // }
  
}

module.exports = generateQrcode;
