function getAllUsers () {
  $.ajax({ 
    type: 'GET', // GET REQUEST
    url: '/api/users', // Endpoint
    success: function(data) {console.log("SUCCESS: OBTAINED ALL USERS: " + data)},
    error: function(err) {console.log("ERROR: COULD NOT GET ALL USERS   ")}
  });
}


function postUser (username, password, daily_goal) {
  $.ajax({
    type: 'POST', // POST REQUEST
	url: '/api/users', // Endpoint
	data: JSON.parse({username: username, password: password, daily_goal: daily_goal}),
	success: function (data) {console.log("SUCCESS: POSTED USER: " + data)},
    error: function(err) {console.log("ERROR: COULD NOT POST USER   ")} 
  });
}

function getSingleUser () {
  $.ajax({
    type: 'GET', // GET REQUEST
    url: '/api/users/:username', // Endpoint
    success: function(data) { console.log("SUCCESS: OBTAINED INDIVIDUAL USER: " + data)},
    error: function(err) {console.log("ERROR: COULD NOT GET INDIVIDUAL USER   ")}
  });
}



