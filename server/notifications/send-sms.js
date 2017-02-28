// Twilio Credentials
var accountSid = 'ACfa9fe10bf0c085da49bcc44f84902449'; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTH || require('../config/config.js').TWILIO_AUTH;

//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 
 
var sendText = function(name, recipientNumber, reflections) {
	var number = "'+1" + recipientNumber + "'";
	client.messages.create({ 
	    to: number, 
	    from: "+14252303081", 
	    body: "Hello, " + name + ". Welcome to FocusPro! How well do you think you spent your time today?" 
	}, function(err, message) { 
	    console.log(err, message); 
	});
};

module.exports = sendText;