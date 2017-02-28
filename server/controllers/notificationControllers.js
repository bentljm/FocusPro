var sendEmail = require('../notifications/emailNotification.js');
var sendText = require('../notifications/send-sms.js');
var db = require('../databases/Schema.js');

function sendNotification (req, res, next) {
	var auth0_id = req.params.auth0_id;
	var name = req.body.name;
	db.Reflection.findAll({where: {auth0_id: auth0_id}}).then(function (reflections) {
		console.log("REFLECTIONS", reflections);
		if(req.body.address.indexOf('@') !== -1) {
			var userEmail = req.body.address;
			reflections.length === 0 ? sendEmail(name, userEmail) : sendEmail(name, userEmail, reflections);
		} else {
			var userText = req.body.address;
			sendText(name, userText);
		}
		console.log("SENT NOTIFICATIONS TO", userEmail || userText);
	});
}

module.exports = {
	sendNotification: sendNotification
};
