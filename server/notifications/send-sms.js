// Twilio Credentials
var accountSid = 'ACfa9fe10bf0c085da49bcc44f84902449'; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTH || require('../config/config.js').TWILIO_AUTH;

//require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);

var sendText = function(recipientNumber) {
	var number = "'+1" + recipientNumber + "'";
	client.messages.create({
	    to: number,
	    from: "+14252303081",
	    body: "Welcome to FocusPro!",
	}, function(err, message) {
	    console.log(err, message);
	});
};

module.exports = sendText;