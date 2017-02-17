var db = require('../server/databases/Schema');
var parser  = require('body-parser');
var express = require('express');
var app = express();


function getAllUsers(req, res, next) {
  db.any('select * from users').then(function(data) {
  	res.status(200).json({
  		status: 'success', 
  		data: data, message: 
  		'RETREIVED ALL USERS'
  	})
  }).catch(function (err) {
  	return next(err);
  })
}

function getSingleUser(req, res, next) {
  var userName = req.params.username;
  db.one('select * from users where id = $1', userName).then(function (data) {
  	res.status(200).json({
  		status: 'success',
  		data: data,
  		message: 'GOT ONE USER FROM DATA BASE: NAME' + userName;
  	})
  }).catch(function (err) {
  	return next(err);
  })
}

function getSetting(req, res, next) {
  var settings = req.params.username.setting;
  db.one('select * from users')
}

function getBlackList(req, res, next) {

}


module.exports = {
	getAllUsers: getAllUsers,
	getSingleUser: getSingleUser
}