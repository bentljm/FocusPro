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
  var username = req.params.username;
  db.User.find({where: {username: username}}).then(function (user) {
      db.Setting.findAll({}).then(function (data) {
      res.status(200).json({
      status: 'success',
      data: data,
      message: 'GOT ALL SETTINGS FOR USER   ' + username
    });
  }).catch(function (err) {
    return next(err);
  });
  })
 
}



function postSetting(req, res, next) { // add all fields
  var username = req.params.username;
  db.User.find({where: {username: username}}).then(function (user) {
      var setting = req.params.id;
      var picture = req.body.picture;
      var reflection_freq = req.body.reflection_freq;
      var reminder = req.body.reminder;
      var reminder_type = req.body.reminder_type;
      var reminder_freq = req.body.reminder_freq;
      var reminder_address = req.body.reminder_address;
      db.Setting.create({picture: picture, reflection_freq: reflection_freq, reminder: reminder,
        reminder_type: reminder_type, reminder_freq: reminder_freq, reminder_address: reminder_address}).then(function (data) {
        res.status(201).json({
        status: 'success',
        data: data,
        message: 'GOT ALL SETTINGS FOR USER   ' + username
      });
    }).catch(function (err) {
      return next(err);
  }).catch(function (err) {
    return next(err);
  });
 
});
}

function getBlackList(req, res, next) {
  var username = req.params.username;
  db.User.find({where: {username: username}}).then(function (user) {
     db.Url.findAll({}).then(function (data) {
    res.status(200).json({
      status: 'success', 
      data: data,
      message: 'BLACKLISTED URLS'
    })
  }).catch(function (err) {
    return next(err);
  });
  }).catch(function (err) {
    return next(err);
  });
 
}

function postBlackList(req, res, next) {
   var username = req.params.username;
  db.User.find({where: {username: username}}).then(function (user) {
     db.Url.create({
       url: req.body.url,
      blacklist_type: req.body.blacklist_type,
      blacklist_time: req.body.blacklist_time
     })
    .then(function () {
    res.status(201).json({
      status: 'success', 
      message: 'INSERTED NEW BLACKLIST'
    })
  }).catch(function (err) {
    return next(err);
  });
}).catch(function (err) {
    return next(err);
  });
}

function getExtension(req, res, next) {

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
  })
  }).catch(function (err) {
    return next(err);
  });
}

function getReflections(req, res, next) {
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
  }).catch(function (err) {
    return next(err);
  });
});
}

function getReflectionId(req, res, next) {
   var username = req.params.username;
  db.User.find({where: {username: username}}).then(function (user) {
  var id = req.params.reflection_id;
  db.Reflection.find({where: {id: id}}).then(function (data) {
    res.status(200).json({
      status: 'success',
      data: data,
      message: 'GOT REFLECTION FROM DATABASE: id ' + id
    })
  }).catch(function (err) {
    return next(err);
  }).catch(function (err) {
    return next(err);
  });
});
}

function postReflectionId(req, res, next) {
   var username = req.params.username;
  db.User.find({where: {username: username}}).then(function (user) {
  db.Reflection.create({
    answer: req.body.answer
   })
  .then(function () {
    res.status(201).json({
      status: 'success', 
      message: 'INSERTED NEW REFLECTION'
    })
  }).catch(function (err) {
    return next(err);
  }).catch(function (err) {
    return next(err);
  });
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
  })

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
  })
  }).catch(function (err) {
  return next(err);
})
}

function postSingleGoal(req, res, next) {
   var user = req.params.user;
  db.User.find({where: {username: user}}).then(function (data) {
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
  }).catch(function (err) {
  return next(err);
})
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
  }).catch(function (err) {
  return next(err);
});
})
}


function postSubGoal(req, res, next) {
   var user = req.params.user;
  db.User.find({where: {username: user}}).then(function (data) {
  db.Subgoal.create({
    subgoal: req.body.subgoal,
    status: req.body.status
   })
  .then(function () {
    res.status(201).json({
      status: 'success', 
      message: 'INSERTED NEW SUBGOAL'
    })
  }).catch(function (err) {
    return next(err);
  }).catch(function (err) {
  return next(err);
});
});
}

module.exports = {
	getAllUsers: getAllUsers,
	getSingleUser: getSingleUser,
  getSetting: getSetting,
  postSetting: postSetting,
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
