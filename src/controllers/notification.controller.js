const sealedbox = require('tweetnacl-sealedbox-js');
const expenseTracking = require("../modules/expense-tracking.module")

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

  const amount = text.match(/\d+(\.\d+)/g).map(function(v) { return parseFloat(v); });

  if(packageName == "com.kasikorn.retail.mbanking.wap" && amount.lengh > 0){
    return await expenseTracking(new Date(time),title,amount[0], "transfer")
  }
};