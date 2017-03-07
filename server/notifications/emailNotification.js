var nodemailer = require('nodemailer');
var fs = require('fs');
var handlebars = require('handlebars');
var gmailPass = process.env.GMAIL_PASS || require('../config/config.js').GMAIL_PASS;
var CronJob = require('cron').CronJob;
var notificationFreq;

function sendMail(name, receiver, frequency, reflections) {
  console.log("NOTIFICATION SENT");
  //loop thru reflections and grab all the questions
  // var reflect = 0;
  // for (var i = 0; i < reflections.length; i++) {
  //   //console.log(reflections[i].dataValues.id);
  //   reflect+=reflections[i].dataValues.id;
  // }
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
       // Runs every weekday (Monday through Friday) or once on Tuesday at 9:30 AM depending on user input
      frequency === '1' ? notificationFreq = '00 30 09 * * 1-5' : notificationFreq = '00 30 09 * * 2'; 
      //console.log(notificationFreq)
      //create new timeframe and pass in notificationFreq
      var job = new CronJob(notificationFreq, function() {
        //send email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });

      }, function () {
          /* This function is executed when the job stops */
          console.log("DONE");
        },
        true, /* Start the job right now */
        'America/Los_Angeles' /* Time zone of this job. */
      );
    }
  });
}

module.exports = sendMail;


  
