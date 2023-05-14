const qrcode = require('qrcode')
const generatePayload = require('promptpay-qr')
const { putBlob,getBlobUrl,deleteBlob } = require('../utilities/storage.utility')
const { createBubble } = require("../utilities/line.utility");

const generateQrcode = async (amount) => {

  const mobileNumber = '080-608-1559'
  const payload = generatePayload(mobileNumber, { amount })
  
  const bufferImage = await qrcode.toBuffer(payload, {
      type: 'jpg',
      errorCorrectionLevel: 'H',
  });

  const blobName = await putBlob(bufferImage, ".jpg")
  const blobUrl = await getBlobUrl(blobName)

  const body = {
    type: "box",
    layout: "hotizontal",
    contents: [
       {
        type: 'image',
        originalContentUrl: blobUrl,
        previewImageUrl: ''
      }
      ,{
        type: "text",
        text: `${amount} บาท`,
      },
    ]
  };
  const bubble = createBubble('QRCode Promptpay',body)

  await deleteBlob(blobName);

  return bubble;
}

module.exports = generateQrcode;
