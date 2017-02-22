//
// username: {type: Sequelize.STRING, unique: true},
 // password: Sequelize.STRING,
 // daily_goal: Sequelize.STRING
//

function getAllUsers () {
  $.ajax({
    type: 'GET',
    url: '/api/users',
    success: function(data) {console.log("SUCCESS: OBTAINED ALL USERS: " + data)},
    error: function(err) {console.log("ERROR: COULD NOT GET ALL USERS   ")}
  });
}

function postUser (username, password, daily_goal) {
  $.ajax({
    type: 'POST',
	url: '/api/users',
	data: JSON.parse({username: username, password: password, daily_goal: daily_goal}),
	success: function (data) {console.log("SUCCESS: POSTED USER: " + data)},
    error: function(err) {console.log("ERROR: COULD NOT POST USER   ")} 
  });
}

function getSingleUser () {
  $.ajax({
    type: 'GET',
    url: '/api/users/:username',
    success: function(data) { console.log("SUCCESS: OBTAINED INDIVIDUAL USER: " + data)},
    error: function(err) {console.log("ERROR: COULD NOT GET INDIVIDUAL USER   ")}
  });
}

function getSettings () {
  $.ajax({
    type: 'GET',
    url: '/api/users/:username/setting',
    success: function(data) {console.log("SUCCESS: OBTAINED ALL SETTINGS: " + data)},
    error: function(err) {console.log("ERROR: COULD NOT GET SETTINGS  ")}
 });
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
    error: function(errconsole.log("ERROR: ")})
}

function getBlackList () {
  $.ajax({
    type: 'GET',
    url: '/api/users/:username/setting/blacklist',
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL USERS: " + data)
    };
    error: function(errconsole.log("ERROR: ")})
}

function postBlackList (url, blacklist_type, blacklist_time) {
  $.ajax({
    type: 'POST',
    url: '/api/users/:username/setting/blacklist',
    data: ({url: url, blacklist_type: blacklist_type, blacklist_time: blacklist_time}),
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL USERS: " + data)
    };
    error: function(errconsole.log("ERROR: ")})
}

function getExtension () {
  $.ajax({
    type: 'GET',
    url: '/api/users/:username/extension_data',
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL USERS: " + data)
    };
    error: function(errconsole.log("ERROR: ")})
}
function getReflections () {
  $.ajax({
    type: 'GET',
    url: '/api/users/:username/goals/:goal_id/reflections',
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL USERS: " + data)
    };
    error: function(errconsole.log("ERROR: ")})
}

function getReflectionId () {
  $.ajax({
    type: 'GET',
    url: '/api/users/:username/goals/:goal_id/reflections/:reflection_id,
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL USERS: " + data)
    };
    error: function(errconsole.log("ERROR: ")})
}



function postReflectionId (answer) {
  $.ajax({
    type: 'POST',
    url: '/api/users/:username/goals/:goal_id/reflections/:reflection_id,
    data: ({answer: answer}),
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL USERS: " + data)
    };
    error: function(errconsole.log("ERROR: ")})
}




function getAllGoals () {
  $.ajax({
    type: 'GET',
    url: '/api/users/:username/goals/:goal_id',
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL USERS: " + data)
    };
    error: function(errconsole.log("ERROR: ")})
}




function getSingleGoal () {
  $.ajax({
    type: 'GET',
    url: '/api/users/:username/goals/:goal_id',
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL USERS: " + data)
    };
    error: function(errconsole.log("ERROR: ")})
}



function postSingleGoal (goal, progress, goal_picture) {
  $.ajax({
    type: 'POST',
    url: '/api/users/:username/:goal_id',
    data: ({goal: goal, progress: progress, goal_picture: goal_picture}),
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL USERS: " + data)
    };
    error: function(errconsole.log("ERROR: ")})
}




function getSubGoals () {
  $.ajax({
    type: 'GET',
    url: '/api/users/:username/goals/:goal_id/subgoals',
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL SUBGOALS: " + data)
    };
    error: function(errconsole.log("ERROR: ")})
}



function postSubGoals (subgoal, status) {
  $.ajax({
    type: 'POST',
    url: '/api/users/:username/goals/:goal_id/subgoals',
    data: JSON.parse({ subgoal: subgoal, status: status }),
    success: function(data) {
      console.log("SUCCESS: OBTAINED ALL SUBGOALS: " + data)
    },
    error: function(errconsole.log("ERROR: ")})
}