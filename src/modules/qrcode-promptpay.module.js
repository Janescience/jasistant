const qrcode = require('qrcode')
const generatePayload = require('promptpay-qr')
const { putBlob,getBlobUrl,deleteBlob } = require('../utilities/storage.utility')

const generateQrcode = async (amount) => {

  const mobileNumber = '080-608-1559'
  const payload = generatePayload(mobileNumber, { amount })
  
  const bufferImage = await qrcode.toBuffer(payload, {
      type: 'jpg',
      errorCorrectionLevel: 'H',
  });

  const blobName = await putBlob(bufferImage, ".jpg")
  const blobUrl = await getBlobUrl(blobName)

  const message = {
    type: 'image',
    originalContentUrl: blobUrl,
    previewImageUrl: blobUrl
  };

  await deleteBlob(blobName);
  
  return message;
}

module.exports = generateQrcode;
