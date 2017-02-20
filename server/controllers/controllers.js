var db = require('../databases/Schema.js');
var parser  = require('body-parser');
var express = require('express');
var app = express();


function getAllUsers(req, res, next) {
  db.User.findAll({}).then(function(data) {
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
  var username = req.params.username;
  db.User.find({where: {username: username}}).then(function (data) {
    res.status(200).json({
      status: 'success',
      data: data,
      message: 'GOT USER FROM DATABASE: username' + username
    })
  }).catch(function (err) {
    return next(err);
  });
}

function getSetting(req, res, next) {
  var settings = req.body.setting;
  db.Setting.find({where: {picture: settings}}).then(function (data) {
    res.status(200).json({
      status: 'success',
      data: data,
      message: 'GOT SETTINGS FROM DATABASE: ID   ' + settings
    });
  }).catch(function (err) {
    return next(err);
  });
}

function getBlackList(req, res, next) {
  db.Url.findAll({}).then(function (data) {
    res.status(200).json({
      status: 'success', 
      data: data,
      message: 'BLACKLISTED URLS'
    })
  }).catch(function (err) {
    return next(err);
  });
}

function postBlackList(req, res, next) {
   db.Url.create({
    url: req.body.url,
    blacklist_type: req.body.blacklist_type,
    blacklist_time: req.body.blacklist_time
   })
//  db.Url.create('insert into Url(url, blacklist_type, blacklist_name)'
  //  + 'values(${url} + ${blacklist_type} + ${blacklist_name})', req.body)
  .then(function () {
    res.status(201).json({
      status: 'success', 
      message: 'INSERTED NEW BLACKLIST'
    })
  }).catch(function (err) {
    return next(err);
  });
}

function getExtension(req, res, next) {
  db.Extension.findAll({}).then(function (data) {
    res.status(200).json({
      status: 'success',
      data: data,
      message: 'OBTAINED EXTENSIONS'
    });
  }).catch(function (err) {
    return next(err);
  });
}

function getReflections(req, res, next) {
  db.Reflection.findAll({}).then(function (data) {
    res.status(200).json({
      status: 'success',
      data: data,
      message: 'OBTAINED REFLECTIONS'
    });
  }).catch(function (err) {
    return next(err);
  });
}

function getReflectionId(req, res, next) {
  var answer = req.params.answer;
  db.User.find({where: {answer: answer}}).then(function (data) {
    res.status(200).json({
      status: 'success',
      data: data,
      message: 'GOT USER FROM DATABASE: answer ' + answer
    })
  }).catch(function (err) {
    return next(err);
  });
}

function postReflectionId(req, res, next) {
  db.Url.create({
    answer: req.body.answer
   })
  .then(function () {
    res.status(201).json({
      status: 'success', 
      message: 'INSERTED NEW REFLECTION'
    })
  }).catch(function (err) {
    return next(err);
  });
}

function getAllGoals(req, res, next) {
  db.Goal.findAll({}).then(function (data) {
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
  db.Goal.create({
    goal: req.body.goal,
    progress: req.body.progress,
    goal_picture: req.body.goal_picture
   })
  .then(function () {
    res.status(201).json({
      status: 'success', 
      message: 'INSERTED NEW GOAL'
    })
  }).catch(function (err) {
    return next(err);
  });
}

function getSingleGoal(req, res, next) {
  var id = req.params.id
  db.any('select * from Goal where id = $1', id).then(function (data) {
    res.status(200).json({
      status: 'success',
      data: data,
      message: 'RETREIVED ALL GOALS'
    });
  }).catch(function (err) {
    return next(err);
  })
}

function postSingleGoal(req, res, next) {
  db.User.findById('insert into Goal(goal, progress, goal_picture)'
    + 'values($1, $2, $3)', [req.params.goal, req.params.progress, req.params.goal_picture])
  .then(function () {
    res.status(201).json({
      status: 'success',
      message: 'Inserted goals'
    });
  }).catch(function (err) {
    return next(err);
  })
}


function getSubGoals(req, res, next) {
  db.Subgoal.findAll({}).then(function(data) {
    res.status(200).json({
      status: 'success', 
      data: data, 
      message: 'RETREIVED ALL SUBGOALS'
    });
  }).catch(function (err) {
    return next(err);
  });
}


function postSubGoals(req, res, next) {
  db.User.findById('insert into Subgoal(subgoal, status)' 
    + 'values(${subgoal} + ${status})', req.body)
  .then(function () {
    res.status(201).json({
      status: 'success',
      message: 'INSERTED SUBGOALS'
    });
  }).catch(function (err) {
    return next(err);
  })
}

module.exports = {
	getAllUsers: getAllUsers,
	getSingleUser: getSingleUser,
  getSetting: getSetting,
  getBlackList: getBlackList,
  postBlackList: postBlackList,
  getExtension: getExtension,
  getAllGoals: getAllGoals,
  postAllGoals: postAllGoals,
  getReflections: getReflections,
  getReflectionId: getReflectionId,
  postReflectionId: postReflectionId,
  getSingleGoal: getSingleGoal,
  postSingleGoal: postSingleGoal,
  getSubGoals: getSubGoals,
  postSubGoals: postSubGoals
}
