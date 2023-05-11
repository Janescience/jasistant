const qrcode = require('qrcode')
const generatePayload = require('promptpay-qr')
const fs = require('fs') 
const { createBubble } = require("./LineMessageUtility");

const generateQrcode = async (amount) => {

  const mobileNumber = '080-608-1559'
  const payload = generatePayload(mobileNumber, { amount })
  
  const options = { type: 'svg', color: { dark: '#000', light: '#fff' } }
  
  await qrcode.toString(payload, options,async (err, svg) => {
      if (err) return console.log(err)
      // await fs.writeFileSync('./qr.svg', svg)
    await fs.writeFile("qr.svg", svg, (err) => {
      if (err)
        console.log(err);
      else {
        console.log("File written successfully\n");
        console.log("The written has the following contents:");
        console.log(fs.readFileSync("qr.svg", "utf8"));
      }
    });
      console.log(svg)
  })

  const message = {
    type: 'image',
    originalContentUrl: "https://cdn.glitch.global/ba0e9e44-2f43-477c-bf01-d31d36d6c61d/profile.jpeg?v=1683800729902",
    previewImageUrl: "https://cdn.glitch.global/ba0e9e44-2f43-477c-bf01-d31d36d6c61d/profile.jpeg?v=1683800729902"
  };

  // const urls = svgToDataURL(qr)
  // return message;
  return "Send"
}

module.exports = generateQrcode;
