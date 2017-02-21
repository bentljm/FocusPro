var db = require('../databases/Schema.js');
var parser  = require('body-parser');
var express = require('express');
var app = express();



// GETTERS



function getAllUsers(req, res, next) { // Get all the users.
  db.User.findAll({}).then(function(data) { // Find all users.
    res.status(200).json({ // Send 200 status upon success.
      status: 'success', 
      data: data, 
      message: 'RETREIVED ALL USERS'
    });
  }).catch(function (err) { // Error handling for callback findAll.
    return next(err);
  });
}

function getSingleUser(req, res, next) { // Get specific user.
  var username = req.params.username; // Obtain specific username.
  db.User.find({where: {username: username}}).then(function (data) { // Find the user with the given username.
    res.status(200).json({ // Send 200 status upon success.
      status: 'success',
      data: data,
      message: 'GOT USER FROM DATABASE: ' + username
    })
  }).catch(function (err) { // Error handling for callback find.
    return next(err);
  });
}

function getSettings(req, res, next) { // Get settings for specific user.
  var username = req.params.username; // Obtain specific username.
  db.User.find({where: {username: username}}).then(function (user) { // Find user with the given username.
    db.Setting.findAll({}).then(function (data) { // Grab settings data for user.
      res.status(200).json({ // Send 200 status upon success.
        status: 'success',
        data: data,
        message: 'GOT ALL SETTINGS FOR USER:  ' + username
      });
    }).catch(function (err) { // Error handling for callback findAll.
      return next(err);
    });
  });
}

function getBlackList(req, res, next) { // Get blacklisted websites for specific user.
  var username = req.params.username; // Obtain specific username.
  db.User.find({where: {username: username}}).then(function (user) { // Find user with the given username.
    db.Url.findAll({}).then(function (data) { // Get all blacklist data.
      res.status(200).json({ // Send 200 status upon success.
        status: 'success', 
        data: data,
        message: 'BLACKLISTED URLS'
      })
    }).catch(function (err) { // Error handling for inner callback findAll.
      return next(err);
    });
  }).catch(function (err) { // Error handling for outer callback find.
    return next(err);
  });
}

function getExtension(req, res, next) { // Get blacklisted websites for specific user.
  var username = req.params.username;
  db.User.find({where: {username: username}}).then(function (user) {
    db.Extension.findAll({}).then(function (data) {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'OBTAINED EXTENSIONS'
      });
    }).catch(function (err) {
      return next(err);
    });
  }).catch(function (err) {
    return next(err);
  });
}

function getReflections(req, res, next) { // Get blacklisted websites for specific user.
  var username = req.params.username;
  db.User.find({where: {username: username}}).then(function (user) {
    db.Reflection.findAll({}).then(function (data) {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'OBTAINED REFLECTIONS'
      });
    }).catch(function (err) {
      return next(err);
    });
  }).catch(function (err) {
    return next(err);
  });
}

function getReflectionId(req, res, next) { // Get blacklisted websites for specific user.
  var username = req.params.username;
  db.User.find({where: {username: username}}).then(function (user) {
    var id = req.params.reflection_id;
    db.Reflection.find({where: {id: id}}).then(function (data) {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'GOT REFLECTION FROM DATABASE: id ' + id
      });
    }).catch(function (err) {
      return next(err);
    });
  }).catch(function (err) {
    return next(err);
  });
}

function getAllGoals(req, res, next) {
  var user = req.params.user;
  db.User.find({where: {username: user}}).then(function (data) {
    db.Goal.findAll({}).then(function (data) {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'RETREIVED ALL GOALS'
      });
    }).catch(function (err) {
      return next(err);
    });
  }).catch(function (err) {
    return next(err);
  });  
}

function getSingleGoal(req, res, next) {
  var user = req.params.user;
  db.User.find({where: {username: user}}).then(function (data) {
    var goal = req.params.goal;
    db.Goal.find({where: {goal: goal}}).then(function (data) {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'RETREIVED ALL GOALS'
      });
    }).catch(function (err) {
      return next(err);
    });
  }).catch(function (err) {
    return next(err);
  });
}

function getSubGoals(req, res, next) {
  var user = req.params.user;
  db.User.find({where: {username: user}}).then(function (data) {
    db.Subgoal.findAll({}).then(function(data) {
      res.status(200).json({
        status: 'success', 
        data: data, 
        message: 'RETREIVED ALL SUBGOALS'
      });
    }).catch(function (err) {
      return next(err);
    });
  }).catch(function (err) {
    return next(err);
  });
}

// SETTERS



function postSettings(req, res, next) { // Post settings for specific user.
  var username = req.params.username; // Obtain specific username.
  db.User.find({where: {username: username}}).then(function (user) { // Find user with the given username.
    var setting = req.params.id; // Use input settings parameters, defined in schema.
    var picture = req.body.picture;
    var reflection_freq = req.body.reflection_freq;
    var reminder = req.body.reminder;
    var reminder_type = req.body.reminder_type;
    var reminder_freq = req.body.reminder_freq;
    var reminder_address = req.body.reminder_address;

    // Create entry in Settings with above parameters.

    db.Setting.create({picture: picture, reflection_freq: reflection_freq, reminder: reminder, reminder_type: reminder_type, reminder_freq: reminder_freq, reminder_address: reminder_address}).then(function (data) {
      res.status(201).json({ // Send 201 status upon success.
        status: 'success',
        data: data,
        message: 'GOT ALL SETTINGS FOR USER   ' + username
      });
    }).catch(function (err) { // Error handling for inner callback create
      return next(err);
    });
  }).catch(function (err) { // Error handling for outer callback find
    return next(err);
  })
}


function postBlackList(req, res, next) { // Post blacklisted websites for specific user.
   var username = req.params.username; // Obtain specific username.
   db.User.find({where: {username: username}}).then(function (user) { // Find user with the given username. 
    var url = req.body.url; // Use input blacklist url parameters, defined in schema.
    var blacklist_type = req.body.blacklist_type;
    var blacklist_time = req.body.blacklist_time

    // Create entry in Url with above parameters.

    db.Url.create({url: req.body.url, blacklist_type: req.body.blacklist_type, blacklist_time: req.body.blacklist_time}).then(function () {
      res.status(201).json({ // Send 201 status upon success.
        status: 'success', 
        message: 'INSERTED NEW BLACKLIST'
      });
    }).catch(function (err) { // Error handling for inner callback create.
      return next(err);
    });
  }).catch(function (err) { // Error handling for outer callback find.
    return next(err);
  });
}

function postReflectionId(req, res, next) { // Post individual reflection for specific user.
  var username = req.params.username; // Obtain specific username.
  db.User.find({where: {username: username}}).then(function (user) { // Find user with the given username.
    var answer = req.body.answer; // Use input reflection parameters, defined in schema.

    // Create entry in Reflection with above parameters.

    db.Reflection.create({answer: req.body.answer}).then(function () {
      res.status(201).json({ // Send 201 status upon success.
        status: 'success', 
        message: 'INSERTED NEW REFLECTION'
      });
    }).catch(function (err) { // Error handling for inner callback create.
      return next(err);
    });
  }).catch(function (err) { // Error handling for outer callback find.
    return next(err);
  });
}

function postSingleGoal(req, res, next) { // Post individual goal for specific user.
  var user = req.params.user; // Obtain specific username.
  db.User.find({where: {username: user}}).then(function (data) { // Find user with the given username.
    var goal = req.body.goal; // Use input goal parameters, defined in schema
    var progress = req.body.progress;
    var goal_picture = req.body.goal_picture;

    // Create entry in Goal with above parameters.

    db.Goal.create({goal: goal, progress: progress, goal_picture: goal_picture}).then(function () {
      res.status(201).json({ // Send 201 status upon success.
        status: 'success', 
        message: 'INSERTED NEW GOAL'
      });
    }).catch(function (err) { // Error handling for inner callback create.
      return next(err);
    });
  }).catch(function (err) { // Error handling for outer callback find.
    return next(err);
 });
}

function postSubGoal(req, res, next) { // Post individual subgoal for specific user.
  var user = req.params.user; // Obtain specific username.
  db.User.find({where: {username: user}}).then(function (data) { // Find user with the given username.
    var subgoal = req.body.subgoal; // Post individual goal for specific user.
    var status = req.body.status;

    // Create entry in Subgoal with above parameters.

    db.Subgoal.create({subgoal: req.body.subgoal, status: req.body.status}).then(function () {
      res.status(201).json({ // Send 201 status upon success.
        status: 'success', 
        message: 'INSERTED NEW SUBGOAL'
      });
    }).catch(function (err) { // Error handling for inner callback create.
      return next(err);
    });
  }).catch(function (err) { // Error handling for outer callback find.
    return next(err);
 });
}



// Export functions to routers...



module.exports = {
	getAllUsers: getAllUsers,
	getSingleUser: getSingleUser,
  getSettings: getSettings,
  postSettings: postSettings,
  getBlackList: getBlackList,
  postBlackList: postBlackList,
  getExtension: getExtension,
  getAllGoals: getAllGoals,
  getReflections: getReflections,
  getReflectionId: getReflectionId,
  postReflectionId: postReflectionId,
  getSingleGoal: getSingleGoal,
  postSingleGoal: postSingleGoal,
  getSubGoals: getSubGoals,
  postSubGoal: postSubGoal
}
