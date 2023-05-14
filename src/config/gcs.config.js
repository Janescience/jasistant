const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    type: "service_account",
    project_id: process.env.GCS_PRIVATE_KEY_ID,
    private_key_id: "29fcb916c4d4c06e88fb6746cdbff54b6233714b",
    private_key: process.env.GCS_PRIVATE_KEY,
    client_email: "assistant-storage@personal-assistant-bot-386307.iam.gserviceaccount.com",
    client_id: "117127222348936198410",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/assistant-storage%40personal-assistant-bot-386307.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
}