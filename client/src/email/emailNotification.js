var nodemailer = require('nodemailer');
var fs = require('fs');

//reusable template to send email
var template1 = '/emailTemplate.html';

function sendMail(template, receiver) {

  var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: 'focusproalert@gmail.com', // Your email id
          pass: 'soccer01' // Your password
      }
    });

   fs.readFile(__dirname + template, 'utf8', function(err, html) {
    if (err) {
      console.log('error', err);
    } else {

      //email options
      var mailOptions = {
        from: '"FocusPro" <focusproalert@gmail.com>',
        to: receiver,
        subject: "It's time for self-reflection!",
        html: html
      };

      //test email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
          console.log('Message %s sent: %s', info.messageId, info.response);
      });
    }
  });
}

//sendMail(template1, "bentljm@gmail.com");

module.exports = sendMail;
