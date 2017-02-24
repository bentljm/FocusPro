function getReflections () {
  $.ajax({
    type: 'GET', // GET REQUEST
    url: '/api/users/:username/goals/:goal_id/reflections', // Endpoint
    success: function(data) {console.log("SUCCESS: OBTAINED ALL REFLECTIONS: " + data)},
    error: function(err) {console.log("ERROR: ")})
  });
}

function getReflectionId () {
  $.ajax({
    type: 'GET', // GET REQUEST
    url: '/api/users/:username/goals/:goal_id/reflections/:reflection_id', // Endpoint
    success: function(data) {console.log("SUCCESS: OBTAINED INDIVIDUAL REFLECTION ID:  " + data)},
    error: function(err) {console.log("ERROR: COULD NOT GET INDIVIDUAL REFLECTION ID   ")})
  });
}

function postReflectionId (answer) {
  $.ajax({
    type: 'POST', // POST REQUEST
    url: '/api/users/:username/goals/:goal_id/reflections/',
    data: ({answer: answer}),
    success: function(data) {console.log("SUCCESS: POSTED INDIVIDUAL REFLECTION ID:   " + data)},
    error: function(err) {console.log("ERROR: COULD NOT POST INDIVIDUAL REFLECTION ID   ")})
  });
}
