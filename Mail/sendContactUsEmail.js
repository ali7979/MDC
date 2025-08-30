const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

// Load the Contact Us email template
const filePath = path.join(__dirname, './contactustemplate.html');
const source = fs.readFileSync(filePath, 'utf8');
const template = handlebars.compile(source);

async function sendContactUsEmail(contactData) {
  const htmlToSend = template(contactData);

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
    from: `"Mama Dream Care" <support@mamadreamcare.com>`,
    to: 'support@mamadreamcare.com', // send to your support inbox
    cc:'aliperwez86@gmail.com ,zohebzob@gmail.com',
    subject: `New Contact Us Message from ${contactData.name}`,
    html: htmlToSend,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending contact email:', err);
    } else {
      console.log('Contact email sent:', info.messageId);
    }
  });
}

module.exports = sendContactUsEmail;
