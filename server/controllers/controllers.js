var db = require('../databases/Schema.js');
var parser  = require('body-parser');
var express = require('express');


// GETTERS

function getAllUsers(req, res, next) { // Get all users from database
  db.any('select * from User').then(function(data) { // Get all data from user database
    res.status(200).json({ // and send a GET.
      status: 'success',
      data: data,
      message: 'RETREIVED ALL USERS'
    });
  }).catch(function (err) { // ERROR HANDLING
    return next(err);
  });
}

function getSingleUser(req, res, next) { // Get a single user from database
  var username = req.params.username; // Access username
  db.one('select * from User where username = $1', username).then(function (data) { // Get entry with this particular username...
    res.status(200).json({ // and send a GET. 
      status: 'success',
      data: data,
      message: 'GOT ONE USER FROM DATABASE: username' + username
    });
  }).catch(function (err) { // ERROR HANDLING
    return next(err);
  });
}

function getSetting(req, res, next) { // Get all settings
  db.any('select * from Setting').then(function (data){ // Get all data from Settings database
    res.status(200).json({// SEND 200 STATUS
      status: 'success',
      data: data,
      message: 'RETREIVED ALL SETTINGS'
    });
  }).catch(function (err) { // ERROR HANDLING
    return next(err);
  });
}

function getBlackList(req, res, next) { // Get all blacklisted websites
  db.any('select * from Url').then(function (data) { // Retrieves all the urls
    res.status(200).json({// SEND 200 STATUS
      status: 'success', 
      data: data,
      message: 'RETRIEVED ALL FORBIDDEN WEBSITES'
    });
  }).catch(function (err) { // ERROR HANDLING
    return next(err);
  });
}

function getExtension(req, res, next) { // Get all extensions
  db.any('select * from Extension').then(function (data) { // Retreive data
    res.status(200).json({// SEND 200 STATUS
      status: 'success',
      data: data,
      message: 'RETRIEVED ALL EXTENSIONS'
    });
  }).catch(function (err) {
    return next(err);
  });
}

function getSingleGoal(req, res, next) { // Get an individual goal
  var id = req.params.id; // Get id of individual goal
  db.one('select * from Goal where username = $1', id).then(function (data) { // Locate goal in SingleGoal...
    res.status(200).json({
      status: 'success',
      data: data,
      message: 'RETRIEVED GOAL: ID' + id
    });
  }).catch(function (err) { // ERROR HANDLING
    return next(err);
  })
}

function getReflections(req, res, next) {
  db.any('select * from Reflection').then(function (data) {
     res.status(200).json({ // SEND 200 CODE
      status: 'success',
      data: data,
      message: 'RETRIEVED REFLECTIONS'
    });
  }).catch(function (err) { // ERROR HANDLING
    return next(err);
  });   
}

function getReflectionId(req, res, next) {
  var id = req.params.id;
  db.one('select * from Reflection where id = $1', id).then(function (data) {
    res.status(200).json({
      status: 'success',
      data: data,
      message: 'RETRIEVED REFLECTION: ID' + id
    });
  }).catch(function (err) { // ERROR HANDLING
    return next(err);
  });
}

function getAllGoals(req, res, next) { // Get everything in goal schema
  db.any('select * from Goal').then(function (data) { // GET ALL GOALS
    res.status(200).json({ // SEND 200 STATUS
      status: 'success',
      data: data,
      message: 'RETRIEVED GOALS'
    });
  }).catch(function (err) { // ERROR HANDLING
    return next(err);
  });
}

function getSubGoals(req, res, next) {  // Get subgoals
  db.any('select * from Subgoal').then(function (data) { // GET ALL SUBGOAL DATA
    res.status(200).json({ // SEND 200 CODE
      status: 'success',
      data: data,
      message: 'RETRIEVED SUBGOALS'
    });
  }).catch(function (err) { // ERROR HANDLING
    return next(err);
  });
}


// POSTERS

function postBlackList(req, res, next)  {
  console.log("HELLO WORLD")
}

function postReflectionId(req, res, next) {
  console.log("HELLO WORLD");
}

function postAllGoals(req, res, next) {
  console.log("HELLO WORLD");
}

function postSingleGoal(req, res, next) {
  console.log("HELLO WORLD");
}

function postSubGoals(req, res, next) {
  console.log("HELLO WORLD");
}

module.exports = { // Module exports object.
  getAllUsers: getAllUsers,
  getSingleUser: getSingleUser,
  getSetting: getSetting,
  getBlackList: getBlackList,
  getExtension: getExtension,
  getSingleGoal: getSingleGoal,
  getReflections: getReflections,
  getReflectionId: getReflectionId,
  getAllGoals: getAllGoals,
  getSubGoals: getSubGoals,
  postBlackList: postBlackList,
  postReflectionId: postReflectionId,
  postAllGoals: postAllGoals,
  postSingleGoal: postSingleGoal,
  postSubGoals: postSubGoals
}