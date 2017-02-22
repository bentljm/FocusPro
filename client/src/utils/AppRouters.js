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

function postUser (user) {
	$.ajax({
		type: 'POST',
		url: '/api/users'
		success: function (data) {
          console.log("SUCCESS: POSTED ALL USERS: " + data)
		}
        error: function(err) {
    	   throw err;
        } 
	})
}

function getSingleUser (user) {
  $.ajax({
    type: 'GET',
    url: '/api/users/:username',
    data: user,
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

function postSettings () {
  $.ajax({
    type: 'POST',
    url: '/api/users/:username/setting',
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

function postBlackList (blacklist) {
  $.ajax({
    type: 'POST',
    url: '/api/users/:username/setting/blacklist',
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



function postReflectionId (id) {
  $.ajax({
    type: 'POST',
    url: '/api/users/:username/goals/:goal_id/reflections/:reflection_id,
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
    url: '/api/users',
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



function postSingleGoal (goal) {
  $.ajax({
    type: 'POST',
    url: '/api/users/:username/:goal_id',
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



function postSubGoals (subgoals) {
  $.ajax({
    type: 'POST',
    url: '/api/users/:username/goals/:goal_id/subgoals',
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL SUBGOALS: " + data)
    };
    error: function(err) {
    	throw err;
    }
  })
}