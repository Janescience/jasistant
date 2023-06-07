const sealedbox = require('tweetnacl-sealedbox-js');
const expenseTracking = require("../modules/expense-tracking.module")
const { Client } =  require('@line/bot-sdk')
const config = require("../config/line.config");
const { toMessages } = require('../utilities/line.utility')

exports.notification = async (req, res) => {
  const result = sealedbox.open(
    Buffer.from(req.body, 'hex'),
    Buffer.from(process.env.NOTI_PUBLIC_KEY, 'base64'),
    Buffer.from(process.env.NOTI_SECRET_KEY, 'base64')
  );

  const notification = JSON.parse(Buffer.from(result).toString('utf8'));

  const packageName = notification?.packageName
  const title = notification?.title
  const text = notification?.text
  const time = notification?.time

  console.log('notification package : ',packageName)
  console.log('notification title : ',title)

  const amount = await text.match(/\d+(\.\d+)/g).map(function(v) { return parseFloat(v); });
  console.log('notification amount : ',amount)

  if(packageName == "com.kasikorn.retail.mbanking.wap"){
    if(title == 'รายการโอน/ถอน' || title == 'รายการใช้บัตร'){
      console.log('expense recording...')
      const recorded = await expenseTracking(new Date(time),title,amount[0], "transfer")
      const client = new Client(config())
      await client.pushMessage(process.env.LINE_USER_ID,toMessages(recorded.message))
      return res.status(200).send({message : 'Expense recording success.'})
    }
  }
};