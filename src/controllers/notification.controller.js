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


  let amount = 0;
  let match;

  // Regex get Currency from String
  if(match = text.match(/([^\d]|^)((?!0\.00)\d{1,3}(,\d{3})*(\.\d\d))([^\d]|$)/g)){
    amount = Number(match[2].replace(/[^0-9.-]+/g,""))
  }
   
  if(amount > 0){
    if(packageName == "com.kasikorn.retail.mbanking.wap"){
      if(title == 'รายการโอน/ถอน' || title == 'รายการใช้บัตร'){
        await expenseTracking(new Date(time),title,amount, "transfer")
        return res.status(200).send({message : 'Expense recording success.'})
      }
    }
  }
};