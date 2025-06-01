const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, './template.html');
const source = fs.readFileSync(filePath, 'utf8');

const template = handlebars.compile(source);



async function sendOrderConfirmationEmail(toEmail, replacements) {

const htmlToSend = template(replacements);


const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
//   secure: true, // use TLS if port 465
  auth: {
    user: 'support@mamadreamcare.com', // your Hostinger email
    pass: 'MDC@babycare$001', // your Hostinger email password
  },
});

const mailOptions = {
  from: '"Mama Dream Care" <support@mamadreamcare.com>',
  to: toEmail,
  subject: `Order Placed #${replacements.order_number}`,
  html: htmlToSend,
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.error('Error sending mail:', err);
  } else {
    console.log('Email sent:', info.messageId);
  }
});

}

module.exports = sendOrderConfirmationEmail;
