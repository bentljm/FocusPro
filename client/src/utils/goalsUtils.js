function getAllGoals () {
  $.ajax({
    type: 'GET', // GET REQUEST
    url: '/api/users/:username/goals/:goal_id',
    success: function(data) {console.log("SUCCESS: OBTAINED ALL GOALS:  " + data)},
    error: function(err) {console.log("ERROR: COULD NOT GET ALL GOALS   ")})
  });
}

function getSingleGoal () {
  $.ajax({
    type: 'GET', // GET REQUEST
    url: '/api/users/:username/goals/:goal_id',
    success: function(data) {console.log("SUCCESS: OBTAINED INDIVIDUAL GOAL: " + data)},
    error: function(err) {console.log("ERROR: COULD NOT GET INDIVIDUAL GOAL ")})
  });
}

function postSingleGoal (goal, progress, goal_picture) {
  $.ajax({
    type: 'POST', // POST REQUEST
    url: '/api/users/:username/goals',
    data: JSON.parse({goal: goal, progress: progress, goal_picture: goal_picture}),
    success: function(data) {console.log("SUCCESS: POSTED INDIVIDUAL GOAL: " + data)},
    error: function(err) {console.log("ERROR: COULD NOT POST INDIVIDUAL GOAL   ")})
  });
}

function getSubGoals () {
  $.ajax({
    type: 'GET', // GET REQUEST
    url: '/api/users/:username/goals/:goal_id/subgoals',
    success: function(data) {console.log("SUCCESS: OBTAINED ALL SUBGOALS: " + data)},
    error: function(err) {console.log("ERROR: COULD NOT GET SUBGOALS   ")})
  });
}

function postSubGoals (subgoal, status) {
  $.ajax({
    type: 'POST', // POST REQUEST
    url: '/api/users/:username/goals/:goal_id/subgoals',
    data: JSON.parse({ subgoal: subgoal, status: status }),
    success: function(data) {console.log("SUCCESS: POSTED SUBGOALS: " + data)},
    error: function(err) {console.log("ERROR: COULD NOT POST SUBGOALS   ")})
  });
}
