var db = require('../server/databases/Schema');
var parser  = require('body-parser');
var express = require('express');
var app = express();

function getAllUsers(req, res, next) {
  db.any('select * from User').then(function(data) {
  	res.status(200).json({
  		status: 'success',
  		data: data,
  		message: 'RETREIVED ALL USERS'
  	});
  }).catch(function (err) {
  	return next(err);
  });
}

function getSingleUser(req, res, next) {
  var id = parseInt(req.params.id);
  db.one('select * from Users where id = $1', id).then(function (data) {
  	res.status(200).json({
  		status: 'success',
  		data: data,
  		message: 'GOT ONE USER FROM DATABASE: ID' + id;
  	})
  }).catch(function (err) {
  	return next(err);
  });
}

function getSetting(req, res, next) {
  var settings = req.params.setting_id;
  db.one('select * from Users where setting_id = $1', req.params.settings).then(function (data) {
  	res.status(200).json({
  		status: 'success',
  		data: data,
  		message: 'GOT SETTINGS FROM DATABASE: ID' + id;
  	});
  }).catch(function (err) {
    return next(err);
  });
}

function getAllGoals(req, res, next) {
  db.any('select * from Goal').then(function (data) {
    res.status(200).json({
      status: 'success',
      data: data,
      message: 'RETREIVED ALL GOALS'
    });
  }).catch(function (err) {
    return next(err);
  })
}

function postAllGoals(req, res, next) {
  db.none('insert into Goal(goal_id, progress, subgoal_id, goal_picture + goal + reflection_id)'
    + 'values(${goal_id} + ${progress} + ${subgoal_id} + ${goal_picture} + ${goal} + ${reflection_id})', req.body)
  .tnen(function () {
    res.status(200).json({
      status: 'success'
      message: 'Inserted goals'
    });
  }).catch(function (err) {
    return next(err);
  })
}

module.exports = {
	getAllUsers: getAllUsers,
	getSingleUser: getSingleUser
}