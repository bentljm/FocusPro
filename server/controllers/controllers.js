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
    console.log("USER FROM GET SETTINGS ", + user.id);
    var UserId = user.id;
    db.Setting.find({where: {UserId: UserId}}).then(function (data) { // Grab settings data for user.
      res.status(200).json({ // Send 200 status upon success.
        status: 'success',
        data: data,
        message: 'GOT SETTINGS FOR USER: ' + username
      });
    }).catch(function (err) { // Error handling for callback findAll.
      return next(err);
    });
  });
}

function getBlackList(req, res, next) { // Get blacklisted websites for specific user.
  var username = req.params.username; // Obtain specific username.
  db.User.find({where: {username: username}}).then(function (user) { // Find user with the given username.
    var UserId = user.id;
    db.Setting.find({where: {UserId: UserId}}).then(function(setting) {
      var SettingId = setting.id;
      db.Url.findAll({where: {SettingId: SettingId}}).then(function (data) { // Get all blacklist data.
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
  }).catch(function (err) {
    return next(err);
  });

}

function getExtension(req, res, next) { // Get extensions for specific user.
  var username = req.params.username; // Obtain specific username.
  db.User.find({where: {username: username}}).then(function (user) { // Find user with the given username.
    var UserId = user.id;
    db.Extension.findAll({where: {UserId: UserId}}).then(function (data) { // Get all extension data.
      res.status(200).json({ // Send 200 status upon success.
        status: 'success',
        data: data,
        message: 'OBTAINED EXTENSIONS'
      });
    }).catch(function (err) { // Error handling for inner callback findAll.
      return next(err);
    });
  }).catch(function (err) { // Error handling for outer callback find.
    return next(err);
  });
}

function getReflections(req, res, next) { // Get all reflections for specific user.
  var username = req.params.username; // Obtain specific username.
  db.User.find({where: {username: username}}).then(function (user) { // Find user with the given username.
    var UserId = user.id;
    var GoalId = req.params.goal_id;
    db.Reflection.findAll({where: {GoalId: GoalId, UserId: UserId}}).then(function (data) { // Get all reflection data.
      res.status(200).json({ // Send 200 status upon success.
        status: 'success',
        data: data,
        message: 'OBTAINED REFLECTIONS'
      });
    }).catch(function (err) { // Error handling for inner callback findAll.
      return next(err);
    });
  }).catch(function (err) { // Error handling for outer callback find.
    return next(err);
  });
}

function getReflectionId(req, res, next) { // Get individual reflection for specific user.
  var username = req.params.username; // Obtain specific username.
  db.User.find({where: {username: username}}).then(function (user) { // Find user with the given username.
    var UserId = user.id; // Get id of requested reflection.
    db.Goal.find({where: {UserId: UserId}}).then(function(goal) {
      var GoalId = req.params.goal_id;
      var id = req.params.reflection_id;
      db.Reflection.find({where: {GoalId: GoalId, id: id, UserId: UserId}}).then(function (data) { // Find reflection with aforementioned id.
        res.status(200).json({ // Send 200 status upon success.
        status: 'success',
        data: data,
        message: 'GOT REFLECTION FROM DATABASE: GOALID ' + GoalId + ' REFLECTIONID ' + id
      });
      }).catch(function (err) { // Error handling for inner callback find.
        return next(err);
      });
    }).catch(function (err) { // Error handling for outer callback find.
      return next(err);
  }).catch(function (err) {
    return next(err);
  });
  });
}

function getAllGoals(req, res, next) { // Get all goals for specific user.
  var username = req.params.username; // Obtain specific username.
  db.User.find({where: {username: username}}).then(function (user) { // Find user with the given username.
    var UserId = user.id;
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

function getSingleGoal(req, res, next) { // Get individual goal for specific user.
  var username = req.params.username; // Obtain specific username.
  db.User.find({where: {username: username}}).then(function (user) { // Find user with the given username.
    var UserId = user.id; // Get the specific user
    var id = req.params.goal_id; // Get the specific goal.
    db.Goal.find({where: {UserId: UserId, id: id}}).then(function (data) { // Find goal with aforementioned goal name.
      res.status(200).json({ // Send 200 status upon success.
        status: 'success',
        data: data,
        message: 'RETRIEVED SPECIFIC GOAL ' + id
      });
    }).catch(function (err) { // Error handling for inner callback find.
      return next(err);
    });
  }).catch(function (err) { // Error handling for outback callback find.
    return next(err);
  });
}

function getSubGoals(req, res, next) { // Get all subgoals for specific user.
  var username = req.params.username; // Obtain specific username.
  db.User.find({where: {username: username}}).then(function (user) { // Find user with the given username.
    var UserId = user.id;
    var id = req.params.goal_id; // Get specific goal.
    db.Goal.find({where: {UserId: UserId, id: id}}).then(function (goal) { // Look up goal.
      db.Subgoal.findAll({where: {GoalId: id,  UserId: UserId}}).then(function(data) { // Get all subgoal data of goal..
        res.status(200).json({ // Send 200 status upon success.
          status: 'success',
          data: data,
          message: 'RETRIEVED ALL SUBGOALS'
        });
      }).catch(function (err) { // Error handling for inner callback findAll.
        return next(err);
      });
    }).catch(function (err) { // Error handling for middle callback find.
      return next(err);
    });
  }).catch(function (err) { // Error handling for outer callback find.
    return next(err);
  });
}



// SETTERS



function postUser(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var daily_goal = req.body.daily_goal;
  db.User.create({username: username, password: password, daily_goal: daily_goal}).then(function (data) {
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
  var username = req.params.username; // Obtain specific username.
  db.User.find({where: {username: username}}).then(function (user) { // Find user with the given username.
    var setting = req.params.id; // Use input settings parameters, defined in schema.
    var picture = req.body.picture;
    var reflection_freq = req.body.reflection_freq;
    var reminder = req.body.reminder;
    var reminder_type = req.body.reminder_type;
    var reminder_freq = req.body.reminder_freq;
    var reminder_address = req.body.reminder_address;
    var UserId = user.id;

    // Create entry in Settings with above parameters.

    db.Setting.create({picture: picture, reflection_freq: reflection_freq, reminder: reminder, reminder_type: reminder_type, reminder_freq: reminder_freq, reminder_address: reminder_address, UserId: UserId}).then(function (data) {
      res.status(201).json({ // Send 201 status upon success.
        status: 'success',
        data: data,
        message: 'GOT ALL SETTINGS FOR USER ' + username
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
    var UserId = user.id;
    var url = req.body.url; // Use input blacklist url parameters, defined in schema.
    var blacklist_type = req.body.blacklist_type;
    var blacklist_time = req.body.blacklist_time

    // Create entry in Url with above parameters.
    db.Setting.find({where: {UserId: UserId}}).then(function (setting) {
      var SettingId = setting.id;
      db.Url.create({url: req.body.url, blacklist_type: req.body.blacklist_type, blacklist_time: req.body.blacklist_time, SettingId: SettingId}).then(function () {
        res.status(201).json({ // Send 201 status upon success.
          status: 'success',
          message: 'INSERTED NEW BLACKLIST'
        });
        }).catch(function (err) { // Error handling for inner callback create.
          return next(err);
        });
      }).catch(function (err) { // Error handling for outer callback find.
        return next(err);
      })
    }).catch(function (err) {
      return next(err);
    })
}

function postReflectionId(req, res, next) { // Post individual reflection for specific user.
  var username = req.params.username; // Obtain specific username.
  db.User.find({where: {username: username}}).then(function (user) { // Find user with the given username.
    var UserId = user.id; // Get id of requested reflection.
    db.Goal.find({where: {UserId: UserId}}).then(function(goal) {
      console.log("GOAL", goal)
      var GoalId = req.params.goal_id;
      var answer = req.body.answer;
      db.Reflection.create({answer: answer, GoalId: GoalId, UserId: UserId}).then(function (data) {//Find reflection with aforementioned id.
        res.status(200).json({ // Send 200 status upon success.
        status: 'success',
        data: data,
        message: 'POSTED REFLECTION TO DATABASE: GOALID ' + GoalId + ' REFLECTIONID ' + data.id
      });
      }).catch(function (err) { // Error handling for inner callback find.
        return next(err);
      });
    }).catch(function (err) { // Error handling for outer callback find.
      return next(err);
  }).catch(function (err) {
    return next(err);
  });
  });
}

function postSingleGoal(req, res, next) { // Post individual goal for specific user.
  var username = req.params.username; // Obtain specific username.
  db.User.find({where: {username: username}}).then(function (user) { // Find user with the given username.
    var goal = req.body.goal || ''; // Use input goal parameters, defined in schema
    var progress = req.body.progress || 0;
    var goal_picture = req.body.goal_picture || '';
    var UserId = user.id;

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

function postSubGoal(req, res, next) { // Post individual subgoal for specific user.
  var username = req.params.username; // Obtain specific username.
  db.User.find({where: {username: username}}).then(function (user) { // Find user with the given username.
    var UserId = user.id;
    var id = req.params.goal_id; // Get goal that contains subgoal.

    db.Goal.find({where: {UserId: UserId, id: id}}).then(function (data) { // Find goal.
      var subgoal = req.body.subgoal; // Subgoal parameters.
      var status = req.body.status;

      // Create entry in Subgoal with above parameters.

      db.Subgoal.create({subgoal: subgoal, status: status, GoalId: id, UserId: UserId}).then(function () {
        res.status(201).json({ // Send 201 status upon success.
          status: 'success',
          message: 'INSERTED NEW SUBGOAL ' + subgoal + ' GOALID ' + id
        });
      }).catch(function (err) { // Error handling for inner callback find.
        return next(err);
      });
    }).catch(function (err) { // Error handling for middle callback find.
      return next(err);
    });
  }).catch(function (err) { // Error handling for outer callback find.
    return next(err);
 });
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
  getReflectionId: getReflectionId,
  postReflectionId: postReflectionId,
  getSingleGoal: getSingleGoal,
  postSingleGoal: postSingleGoal,
  getSubGoals: getSubGoals,
  postSubGoal: postSubGoal
};
