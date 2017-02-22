//
// username: {type: Sequelize.STRING, unique: true},
 // password: Sequelize.STRING,
 // daily_goal: Sequelize.STRING
//

function getAllUsers () {
  $.ajax({
    type: 'GET',
    url: '/api/users',
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL USERS: " + data)
    };
    error: function(err) {
    	throw err;
    }
  })
}

function postUser (username, password, daily_goal) {
	$.ajax({
		type: 'POST',
		url: '/api/users',
		data: JSON.parse({username: username, password: password, daily_goal: daily_goal})
		success: function (data) {
          console.log("SUCCESS: POSTED ALL USERS: " + data)
		}
        error: function(err) {
    	   throw err;
        } 
	})
}

function getSingleUser () {
  $.ajax({
    type: 'GET',
    url: '/api/users/:username',
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL USERS: " + data)
    };
    error: function(err) {
    	throw err;
    }
  })
}

function getSettings () {
  $.ajax({
    type: 'GET',
    url: '/api/users/:username/setting',
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL USERS: " + data)
    };
    error: function(err) {
    	throw err;
    }
  })
}


function postSettings (picture, quote, reflection_freq, reminder, reminder_type, reminder_freq, reminder_address) {
  $.ajax({
    type: 'POST',
    url: '/api/users/:username/setting',
    data: ({picture: picture, quote: quote, reflection_freq: reflection_freq, reminder: reminder
    	reminder_type: reminder_type, reminder_freq: reflection_freq, reminder_address: reminder_address})
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL USERS: " + data)
    };
    error: function(err) {
    	throw err;
    }
  })
}

function getBlackList () {
  $.ajax({
    type: 'GET',
    url: '/api/users/:username/setting/blacklist',
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL USERS: " + data)
    };
    error: function(err) {
    	throw err;
    }
  })
}

function postBlackList (url, blacklist_type, blacklist_time) {
  $.ajax({
    type: 'POST',
    url: '/api/users/:username/setting/blacklist',
    data: ({url: url, blacklist_type: blacklist_type, blacklist_time: blacklist_time}),
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL USERS: " + data)
    };
    error: function(err) {
    	throw err;
    }
  })
}

function getExtension () {
  $.ajax({
    type: 'GET',
    url: '/api/users/:username/extension_data',
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL USERS: " + data)
    };
    error: function(err) {
    	throw err;
    }
  })
}
function getReflections () {
  $.ajax({
    type: 'GET',
    url: '/api/users/:username/goals/:goal_id/reflections',
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL USERS: " + data)
    };
    error: function(err) {
    	throw err;
    }
  })
}

function getReflectionId () {
  $.ajax({
    type: 'GET',
    url: '/api/users/:username/goals/:goal_id/reflections/:reflection_id,
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL USERS: " + data)
    };
    error: function(err) {
    	throw err;
    }
  })
}



function postReflectionId (answer) {
  $.ajax({
    type: 'POST',
    url: '/api/users/:username/goals/:goal_id/reflections/:reflection_id,
    data: ({answer: answer}),
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL USERS: " + data)
    };
    error: function(err) {
    	throw err;
    }
  })
}




function getAllGoals () {
  $.ajax({
    type: 'GET',
    url: '/api/users/:username/goals/:goal_id',
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL USERS: " + data)
    };
    error: function(err) {
    	throw err;
    }
  })
}




function getSingleGoal () {
  $.ajax({
    type: 'GET',
    url: '/api/users/:username/goals/:goal_id',
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL USERS: " + data)
    };
    error: function(err) {
    	throw err;
    }
  })
}



function postSingleGoal (goal, progress, goal_picture) {
  $.ajax({
    type: 'POST',
    url: '/api/users/:username/:goal_id',
    data: ({goal: goal, progress: progress, goal_picture: goal_picture}),
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL USERS: " + data)
    };
    error: function(err) {
    	throw err;
    }
  })
}




function getSubGoals () {
  $.ajax({
    type: 'GET',
    url: '/api/users/:username/goals/:goal_id/subgoals',
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL SUBGOALS: " + data)
    };
    error: function(err) {
    	throw err;
    }
  })
}



function postSubGoals (subgoal, status) {
  $.ajax({
    type: 'POST',
    url: '/api/users/:username/goals/:goal_id/subgoals',
    data: JSON.parse({ subgoal: subgoal, status: status }),
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL SUBGOALS: " + data)
    },
    error: function(err) {
    	throw err;
    }
  })
}