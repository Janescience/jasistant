const { Storage } = require("@google-cloud/storage")
const { nanoid } = require("nanoid")

const projectId = 'personal-assistant-bot-386307'
const storage = new Storage({projectId})

let latest

const putBlob = async (buffer, extension) => {
  const blobName = nanoid() + extension
  await storage
    .bucket("tmpblobimg")
    .file(blobName)
    .save(buffer)
  latest = { blobName, buffer }
  return blobName
}

const getBlob = async (blobName) => {
  if (latest && latest.blobName === blobName) {
    return latest.buffer
  }
  const response = await storage
    .bucket("tmpblobimg")
    .file(blobName)
    .download()
  return response[0]
}

const getBlobUrl = async (blobName) => {
  const result = await storage
    .bucket("tmpblobimg")
    .file(blobName)
    .getSignedUrl({
      action: "read",
      expires: new Date(Date.now() + 86400e3),
      version: "v4",
      virtualHostedStyle: true
    })
  return result[0]
}

const cloudStorage = {
  putBlob,
  getBlob,
  getBlobUrl
};

module.exports = cloudStorage;