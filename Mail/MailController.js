const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, './template.html');
const source = fs.readFileSync(filePath, 'utf8');

const template = handlebars.compile(source);

const replacements = {
  customer_name: 'Zoheb',
  order_number: 'MDC123456',
  order_date: 'August 25, 2025',
  shipping_address: '123 Dream St, Fantasy City, IN 54321',
  order_total: '₹1,299',
  order_link: 'https://mamadreamcare.com/orders/MDC123456',
  year: new Date().getFullYear(),
  items: [
    { name: 'Baby Blanket', quantity: 2, price: '₹499' },
    { name: 'Feeding Bottle', quantity: 1, price: '₹299' },
  ],
};

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
  subject: 'Order Confirmation',
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
