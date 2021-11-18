const nodemailer = require("nodemailer");

let testAccount = await nodemailer.createTestAccount();

let transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass
  }
});

const sendProductSaleMail = async (sender) => {
  let info = await transporter.sendMail({
    from: '"Real Action" <noreplyrealaction@gmail.com>',
    to: sender,
    text: "Produto comprado",
    html: "<div>Produto comprado<div>"
  });

  console.log(info.messageId);
}


module.exports = {
  sendProductSaleMail
}