var nodemailer = require('nodemailer');
var fs = require('fs');
var handlebars = require('handlebars');
var gmailPass = process.env.GMAIL_PASS || require('../config/config.js').GMAIL_PASS;


function sendMail(name, receiver, reflections) {

  //reusable template to send email
  var template = '/emailTemplate.html';
  //create transporter
  var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: 'focusproalert@gmail.com', // Your email id
          pass: gmailPass // Your password
      }
    });
  //read through html template
  fs.readFile(__dirname + template, 'utf8', function(err, html) {
    if (err) {
      console.log('error', err);
    } else {
      //compile html using handlebars
      var emailTemplate = handlebars.compile(html);
      //define name and reflection variables
      var emailTemplateVars = {
        name: name || "Guest",
        reflections: reflections || "How well do you think you spent your time today?"
      };
      //inject variables into email template
      var emailHTML = emailTemplate(emailTemplateVars);
      //define email options
      var mailOptions = {
        from: '"FocusPro" <focusproalert@gmail.com>',
        to: receiver,
        subject: "It's time for self-reflection!",
        html: emailHTML
      };
      //send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
          console.log('Message %s sent: %s', info.messageId, info.response);
      });
    }
  });
}

module.exports = sendMail;
