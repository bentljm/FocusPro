var sendEmail = require('../notifications/emailNotification.js');
var sendText = require('../notifications/send-sms.js');
var db = require('../databases/Schema.js');

function sendNotification (req, res, next) {
	var auth0_id = req.params.auth0_id;
	var name = req.body.name;
	var freq = req.body.freq;
	var address = req.body.address;
	db.Reflection.findAll({where: {auth0_id: auth0_id}}).then(function (reflections) {
		//console.log("REFLECTIONS", reflections);
		console.log("REFLECTIONS", reflections);
		if(address.indexOf('@') !== -1) {
			reflections.length === 0 ? sendEmail(name, address, freq) : sendEmail(name, address, freq, reflections);
		} else {
			sendText(name, address, freq);
		}
    res.status(201).send('Notification sent successfully');
  });
}

module.exports = {
	sendNotification: sendNotification
};
