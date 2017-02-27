var sendEmail = require('../notifications/emailNotification.js');
var sendText = require('../notifications/send-sms.js');

function sendNotification (req, res, next) {
  if(req.body.address.indexOf('@') !== -1) {
  	var userEmail = req.body.address;
  	sendEmail(userEmail);
  } else {
  	var userText = req.body.address;
  	sendText(userText);
  }
  console.log("SENT NOTIFICATIONS TO", userEmail || userText);
}

module.exports = {
	sendNotification: sendNotification
};
