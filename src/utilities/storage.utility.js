const { Storage } = require("@google-cloud/storage")
const { nanoid } = require("nanoid")
const path = require("path")
const { google } = require('googleapis');

// Create a JWT client to sign the credentials
const jwtClient = new google.auth.JWT({
  email: 'assistant-storage@personal-assistant-bot-386307.iam.gserviceaccount.com',
  key: process.env.GCS_PRIVATE_KEY,
  scopes: ['https://oauth2.googleapis.com/token']
});

const projectId = 'personal-assistant-bot-386307';
// // Authorize the JWT client and generate an access token
// jwtClient.authorize(async (err, tokens) => {
//   if (err) {
//     console.error(err);
//     return;
//   }

//   // Create a new Credentials object with the access token
//   const credentials = {
//     access_token: tokens.access_token
//   };
// });

const storage = new Storage({
  projectId,
  credentials : {
    access_token : jwtClient.authorize().access_token
  }
});

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
  // if (latest && latest.blobName === blobName) {
  //   return latest.buffer
  // }
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
