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
  var username = parseInt(req.params.username);
  db.one('select * from Users where username = $1', username).then(function (data) {
  	res.status(200).json({
  		status: 'success',
  		data: data,
  		message: 'GOT ONE USER FROM DATABASE: username' + username;
  	})
  }).catch(function (err) {
  	return next(err);
  });
}

function getSetting(req, res, next) {
  var settings = req.params.id;
  db.one('select * from Users where id = $1', settings).then(function (data) {
  	res.status(200).json({
  		status: 'success',
  		data: data,
  		message: 'GOT SETTINGS FROM DATABASE: ID' + id;
  	});
  }).catch(function (err) {
    return next(err);
  });
}

function getBlackList(req, res, next) {
  db.one('select * from Url').then(function (data) {
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
  db.none('insert into Url(url, blacklist_type, blacklist_name)'
    + 'values(${url} + ${blacklist_type} + ${blacklist_name})', req.body)
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
  db.one('select * from Extension').then(function (data) {
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
  db.one('select * from Reflection').then(function (data) {
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
  var id = parseInt(req.params.id);
  db.one('select * from Users where id = $1', id).then(function (data) {
    res.status(200).json({
      status: 'success',
      data: data,
      message: 'GOT ONE USER FROM DATABASE: id' + id;
    })
  }).catch(function (err) {
    return next(err);
  });
}

function postReflectionId(req, res, next) {
  db.none('insert into Reflection(answer)'
    + 'values(${answer})', req.body)
  .then(function () {
    res.status(201).json({
      status: 'success', 
      message: 'INSERTED NEW REFLECTION ID'
    })
  }).catch(function (err) {
    return next(err);
  })
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
  db.none('insert into Goal(goal, progress, goal_picture)'
    + 'values(${goal}, ${progress}, ${goal_picture})' + req.body)
  .then(function () {
    res.status(201).json({
      status: 'success'
      message: 'POSTED GOALS'
    });
  }).catch(function (err) {
    return next(err);
  })
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
  db.none('insert into Goal(goal, progress, goal_picture)'
    + 'values($1, $2, $3)', [req.params.goal, req.params.progress, req.params.goal_picture])
  .tnen(function () {
    res.status(200).json({
      status: 'success'
      message: 'Inserted goals'
    });
  }).catch(function (err) {
    return next(err);
  })
}


function getSubGoals(req, res, next) {
  db.any('select * from Subgoal').then(function(data) {
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
  db.none('insert into Subgoal(subgoal, status)' 
    + 'values(${subgoal} + ${status})', req.body)
  .tnen(function () {
    res.status(200).json({
      status: 'success'
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
  getReflections: getReflections,
  getReflectionId: getReflectionId,
  postReflectionId: postReflectionId,
  getSingleGoal: getSingleGoal,
  postSingleGoal: postSingleGoal,
  getSubGoals: getSubGoals,
  postSubGoals: postSubGoals
}
