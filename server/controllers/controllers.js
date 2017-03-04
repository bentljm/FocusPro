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
      message: 'RETRIEVED ALL USERS'
    });
  }).catch(function (err) { // Error handling for callback findAll.
    return next(err);
  });
}

function getSingleUser(req, res, next) { // Get specific user.
  var auth0_id = req.params.auth0_id; // Obtain specific auth0_id.
  db.User.findOrCreate({where: {auth0_id: auth0_id}}).then(function (data) { // Find the user with the given auth0_id.
    res.status(200).json({ // Send 200 status upon success.
      status: 'success',
      data: data,
      message: 'GOT USER FROM DATABASE: ' + auth0_id
    });
  }).catch(function (err) { // Error handling for callback find.
    return next(err);
  });
}

function getSettings(req, res, next) { // Get settings for specific user.
  var auth0_id = req.params.auth0_id; // Obtain specific auth0_id.
  db.User.find({where: {auth0_id: auth0_id}}).then(function (user) { // Find user with the given username.
    var UserId = user.id; // Get specific user id from find
    db.Setting.findOrCreate({where: {UserId: UserId}}).then(function (data) { // Grab settings data for user.
      res.status(200).json({ // Send 200 status upon success.
        status: 'success',
        data: data,
        message: 'GOT SETTINGS FOR USER: ' + UserId
      });
    }).catch(function (err) { // Error handling for callback findAll.
      return next(err);
    }).catch(function (err) { // Error handling for callback findAll.
      return next(err);
    });
  });
}

function getBlackList(req, res) {
  var auth0_id = req.params.auth0_id; // Obtain specific auth0_id.
  db.Url.findAll({where: {auth0_id: auth0_id}})
  .then((data)=>{
    res.status(200).json({
      data: data
    });
  })
  .catch((err)=>{
    res.send({'ERROR: GET BLACKLIST': err});
  });
}

function getExtension(req, res, next) { // Get extensions for specific user.
  var auth0_id = req.params.auth0_id; // Obtain specific auth0_id.
  db.User.find({where: {auth0_id: auth0_id}}).then(function (user) { // Find user with the given username.
    var UserId = user.id; // Get specific user id from find
    db.Extension.findAll({where: {UserId: UserId}}).then(function (data) { // Get all extension data.
      res.status(200).json({ // Send 200 status upon success.
        status: 'success',
        data: data,
        message: 'OBTAINED EXTENSIONS for User', UserId
      });
    }).catch(function (err) { // Error handling for inner callback findAll.
      return next(err);
    });
  }).catch(function (err) { // Error handling for outer callback find.
    return next(err);
  });
}



function getReflections(req, res) {
  var auth0_id = req.params.auth0_id; // Obtain specific auth0_id.
  db.Reflection.findAll({where: {auth0_id: auth0_id}})
  .then((data)=>{
    res.status(200).json({
      data: data
    });
  })
  .catch((err)=>{
    res.send({'ERROR: GET REFLECTION': err});
  });
}

function getAllGoals(req, res, next) { // Get all goals for specific user.
  var auth0_id = req.params.auth0_id; // Obtain specific auth0_id.
  db.User.find({where: {auth0_id: auth0_id}}).then(function (user) { // Find user with the given username.
    var UserId = user.id; // Get specifc user id from find
    db.Goal.findAll({where: {UserId: UserId}}).then(function (data) {  // Obtain all goal data for user.
      res.status(200).json({ // Send 200 status upon success.
        status: 'success',
        data: data,
        message: 'RETRIEVED ALL GOALS'
      });
    }).catch(function (err) { // Error handling for inner callback findAll.
      return next(err);
    });
  }).catch(function (err) { // Error handling for outer callback find.
    return next(err);
  });
}

function getSingleGoal(req, res) {
  var id = req.params.goal_id;
  db.Goal.find({where: {id: id}})
  .then((data)=>{
    res.status(200).json({
      data: data
    });
  })
  .catch((err)=>{
    res.send({'ERROR: GET SINGLE SUBGOAL': err});
  });
}

function getSubGoals(req, res) {
  var goalId = req.params.goal_id;
  db.Subgoal.findAll({where: { GoalId: goalId}})
  .then((data)=>{
    res.json({
      data: data
    });
  })
  .catch((err)=>{
    res.send({'ERROR: GET SUBGOALS': err});
  });
}

function getSingleSubgoal(req, res) {
  db.Subgoal.find({where: {id: req.params.subgoal_id}})
  .then((data) => {
    res.json({
      data: data
    });
  })
  .catch((err)=>{
    res.send({'ERROR: GET SINGLE SUBGOAL': err});
  });
}


// SETTERS
function postUser(req, res, next) {
  var username = req.body.username; // Grab username from req body
  var auth0_id = req.body.auth0_id; // Grab password from req body
  var email = req.body.email;
  var daily_goal = req.body.daily_goal; // Grab daily goal from req body
  db.User.create({username: username, auth0_id: auth0_id, daily_goal: daily_goal, email: email}).then(function (data) {
    res.status(201).json({ // Send 201 status upon success.
      status: 'success',
      data: data,
      message: 'POSTED USER TO DATABASE ' + username
    });
  }).catch(function (err) { // Error handling for inner callback create
    return next(err);
  });
}

function postSettings(req, res, next) { // Post settings for specific user.
  var auth0_id = req.params.auth0_id; // Obtain specific auth0_id.
  db.User.find({where: {auth0_id: auth0_id}}).then(function (user) { // Find user with the given username.
    var setting = req.params.id; // Use input settings parameters, defined in schema.
    var picture = req.body.picture;
    var quote = req.body.quote;
    var reflection_freq = req.body.reflection_freq;
    var reminder = req.body.reminder;
    var reminder_type = req.body.reminder_type;
    var reminder_freq = req.body.reminder_freq;
    var reminder_address = req.body.reminder_address;
    var UserId = user.id;

    // Create entry in Settings with above parameters.

    db.Setting.create({picture: picture, quote: quote, reflection_freq: reflection_freq, reminder: reminder, reminder_type: reminder_type, reminder_freq: reminder_freq, reminder_address: reminder_address, UserId: UserId}).then(function (data) {
      res.status(201).json({ // Send 201 status upon success.
        status: 'success',
        data: data,
        message: 'GOT ALL SETTINGS FOR USER ' + auth0_id
      });
    }).catch(function (err) { // Error handling for inner callback create
      return next(err);
    });
  }).catch(function (err) { // Error handling for outer callback find
    return next(err);
  });
}


function postBlackList(req, res) {
  var auth0_id = req.params.auth0_id; // Obtain specific auth0_id.
  var url = req.body.url; // Get url from req body
  var blacklist_type = req.body.blacklist_type; // Get blacklist_type from req body
  var blacklist_time = req.body.blacklist_time; // Get blacklist_time from req body
  db.Url.create({url: url, blacklist_type: blacklist_type, blacklist_time: blacklist_time, auth0_id: auth0_id})
  .then(function(data) {
    res.status(201).json({
      data: data,
      message: 'success' + data
    });
  })
  .catch(function(err) {
    res.send({'ERROR: POST BLACKLIST': err});
  });
}


function postReflectionId (req, res) {
  var auth0_id = req.params.auth0_id; // Obtain specific auth0_id.
  var answer = req.body.answer; // Get answer from req body
  var question = req.body.question; // Get question from parameters
  db.Reflection.create({answer: answer, question: question, auth0_id: auth0_id})
  .then(function(data) {
    res.status(201).json({
      data: data,
      message: 'success' + data
    });
  })
  .catch(function(err) {
    res.send({'ERROR: POST REFLECTION': err});
  });

}


function postSingleGoal(req, res, next) { // Post individual goal for specific user.
  var auth0_id = req.params.auth0_id; // Obtain specific auth0_id.
  db.User.find({where: {auth0_id: auth0_id}}).then(function (user) { // Find user with the given username.
    var goal = req.body.goal; // Use input goal parameters, defined in schema
    var progress = req.body.progress;
    var goal_picture = req.body.goal_picture;
    var UserId = user.id; // Get specific user from find

    // Create entry in Goal with above parameters.

    db.Goal.create({goal: goal, progress: progress, goal_picture: goal_picture, UserId: UserId}).then(function (data) {
      res.status(201).json({ // Send 201 status upon success.
        status: 'success',
        data: data,
        message: 'INSERTED NEW GOAL'
      });
    }).catch(function (err) { // Error handling for inner callback create.
      return next(err);
    });
  }).catch(function (err) { // Error handling for outer callback find.
    return next(err);
  });
}

function postSubGoal(req, res) {
  var goalId = req.params.goal_id;
  var status = req.body.status;
  var subgoal = req.body.subgoal;
  //create subGoal for userA's goal1
  db.Subgoal.create({subgoal: subgoal, status: status, GoalId: goalId})
  .then((data)=>{
    res.status(201).json({
      data: data
    });
  })
  .catch((err)=>{
    res.send({'ERROR: POST SUBGOAL': err});
  });
}

//DESTROY

function removeSubGoal(req, res) {
  var id = req.params.subgoal_id;
  db.Subgoal.destroy({where: {id: id}})
  .then((num)=>{
    res.status(200).json({
      numDeleted: num,
      message: `number deleted: ${num}`
    });
  })
  .catch((err)=>{
    res.send({'ERROR: REMOVE SUBGOAL': err});
  });
}


function removeSingleGoal(req, res) {
  var id = req.params.goal_id;
  db.Goal.destroy({where: {id: id}})
  .then((num)=>{
    res.status(200).json({
      numDeleted: num,
      message: `number deleted: ${num}`
    });
  })
  .catch((err)=>{
    res.send({'ERROR: REMOVE SINGLE GOAL': err});
  });
}

function removeBlackList(req, res) {
  var url_id = req.params.url_id;
  db.Url.destroy({where: {id: url_id}})
  .then((num)=>{
    res.status(200).json({
      numDeleted: num,
      message: `number deleted: ${num}`
    });
  })
  .catch((err)=>{
    res.send({'ERROR: REMOVE BLACKLIST': err});
  });
}

//UPDATE

function updateUser(req, res, next) {
  var daily_goal = req.body.daily_goal; // Grab daily goal from req body
  db.User.update({daily_goal: daily_goal}, {where: {auth0_id: req.params.auth0_id}}).then(function (data) {
    res.status(201).json({ // Send 201 status upon success.
      status: 'success',
      data: data,
      message: 'Updated daily goal ' + daily_goal
    });
  }).catch(function (err) { // Error handling for inner callback create
    return next(err);
  });
}

function updateUsername(req, res, next) {
  var username = req.body.username; // Grab daily goal from req body
  db.User.update({username: username}, {where: {auth0_id: req.params.auth0_id}}).then(function (data) {
    res.status(201).json({ // Send 201 status upon success.
      status: 'success',
      data: data,
      message: 'Updated daily goal ' + username
    });
  }).catch(function (err) { // Error handling for inner callback create
    return next(err);
  });
}

function updateSettings(req, res, next) {
  var auth0_id = req.params.auth0_id; // Obtain specific auth0_id.
  db.User.find({where: {auth0_id: auth0_id}}).then(function (user) { // Find user with the given username.
    var UserId = user.id;

    // Update entry in Settings with above parameters.
    db.Setting.update({picture: req.body.picture, quote: req.body.quote, reflection_freq: req.body.reflection_freq, reminder: req.body.reminder, reminder_type: req.body.reminder_type, reminder_freq: req.body.reminder_freq, reminder_address: req.body.reminder_address}, {where: {UserId: UserId}}).then(function (data) {
      res.status(201).json({ // Send 201 status upon success.
        status: 'success',
        data: data,
        message: 'UPDATE SETTINGS ' + data
      });
    }).catch(function (err) { // Error handling for inner callback create
      return next(err);
    });
  }).catch(function (err) { // Error handling for outer callback find
    return next(err);
  });
}

function updateSubgoal(req, res) {
  var id = req.params.subgoal_id;
  db.Subgoal.update({subgoal: req.body.subgoal, status: req.body.status}, {where: {id: id}})
  .then((count)=>{
    res.status(200).json({
      data: count
    });
  })
  .catch((err)=>{
    res.send({'ERROR: UPDATE SUBGOAL': err});
  });
}

function updateSingleGoal(req, res) {
  var id = req.params.goal_id;
  db.Goal.update({goal: req.body.goal, progress: req.body.progress, goal_picture: req.body.goal_picture}, {where: {id: id}})
  .then((count)=>{
    res.status(200).json({
      data: count
    });
  })
  .catch((err)=>{
    res.send({'ERROR: UPDATE SINGLE GOAL': err});
  });
}

function updateBlackList(req, res) {
  var id = req.params.url_id;
  db.Url.update({url: req.body.url, blacklist_type: req.body.blacklist_type, blacklist_time: req.body.blacklist_time}, {where: { id: id}})
  .then((count)=>{
    res.status(200).json({
      data: count
    });
  })
  .catch((err)=>{
    res.send({'ERROR: UPDATE BLACKLIST': err});
  });
}

function upsertExtension(req, res) {
  var auth0_id = req.params.auth0_id;
  db.User.find({where: {auth0_id: auth0_id}}).then(function (user) {
    var userId = user.id;
    var urls = req.body.urls;
    urls.forEach((url) => {
    db.Extension.upsert({url: url.url, time_spent: url.time, freq: url.freq, UserId: user.id}).then((data) => {
      res.status(200).json({
        data: data
      });
    }).catch((err) => { res.send({'ERROR: UPSERT EXTENSION': err}); });
  });

  }).catch((err) => { res.send({'ERROR: UPSERT EXTENSION': err}); });
}

// Export functions to routers...

module.exports = {
  getAllUsers: getAllUsers,
  postUser: postUser,
  getSingleUser: getSingleUser,
  getSettings: getSettings,
  postSettings: postSettings,
  getBlackList: getBlackList,
  postBlackList: postBlackList,
  getExtension: getExtension,
  getAllGoals: getAllGoals,
  getReflections: getReflections,
  postReflectionId: postReflectionId,
  getSingleGoal: getSingleGoal,
  postSingleGoal: postSingleGoal,
  getSubGoals: getSubGoals,
  getSingleSubgoal: getSingleSubgoal,
  postSubGoal: postSubGoal,
  removeSubGoal: removeSubGoal,
  removeSingleGoal: removeSingleGoal,
  removeBlackList: removeBlackList,
  updateSettings: updateSettings,
  updateSubgoal: updateSubgoal,
  updateUser: updateUser,
  updateUsername: updateUsername,
  updateSingleGoal: updateSingleGoal,
  updateBlackList: updateBlackList,
  upsertExtension: upsertExtension
};
