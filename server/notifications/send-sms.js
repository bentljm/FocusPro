// Twilio Credentials
var accountSid = 'ACfa9fe10bf0c085da49bcc44f84902449'; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTH || require('../config/config.js').TWILIO_AUTH;
var CronJob = require('cron').CronJob;
var notificationFreq;

//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 
 
var sendText = function(name, recipientNumber, frequency, reflections) {
	//set phone number
	var number = "'+1" + recipientNumber + "'";
	// Run every weekday (Monday through Friday) or once on Tuesday at 9:30 AM depending on user input
	frequency === '1' ? notificationFreq = '00 30 09 * * 1-5' : notificationFreq = '00 30 09 * * 2'; 
	//create new timeframe and pass in notificationFreq
	var job = new CronJob(notificationFreq, function() {
		client.messages.create({ 
		    to: number, 
		    from: "+14252303081", 
		    body: "Hello, " + name + ". Welcome to FocusPro! How well do you think you spent your time today?" 
		}, function(err, message) { 
		    console.log(err, message); 
		});
	}, function () {
          /* This function is executed when the job stops */
          console.log("DONE");
        },
        true, /* Start the job right now */
        'America/Los_Angeles' /* Time zone of this job. */
    );
};

module.exports = sendText;
