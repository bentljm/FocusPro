function getSettings () {
  $.ajax({
    type: 'GET', // GET REQUEST
    url: '/api/users/:username/setting',
    success: function(data) {console.log("SUCCESS: OBTAINED ALL SETTINGS: " + data)},
    error: function(err) {console.log("ERROR: COULD NOT GET SETTINGS  ")}
 });
}

function postSettings (picture, quote, reflection_freq, reminder, reminder_type, reminder_freq, reminder_address) {
  $.ajax({
    type: 'POST', // POST REQUEST
    url: '/api/users/:username/setting', // Endpoint
    data: ({picture: picture, quote: quote, reflection_freq: reflection_freq, reminder: reminder
    	reminder_type: reminder_type, reminder_freq: reflection_freq, reminder_address: reminder_address}),
    success: function(data) {console.log("SUCCESS: OBTAINED ALL SETTINGS: " + data)},
    error: function(err) {console.log("ERROR: ")})
  });
}

function getBlackList () {
  $.ajax({
    type: 'GET', // GET REQUEST
    url: '/api/users/:username/setting/blacklist', // Endpoint
    success: function(data) {console.log("SUCCESS: OBTAINED BLACKLISTED WEBSITES:  " + data)},
    error: function(err) {console.log("ERROR: COULD NOT GET BLACKLISTED WEBSITES   ")})
  });
}

function postBlackList (url, blacklist_type, blacklist_time) {
  $.ajax({
    type: 'POST', // POST REQUEST
    url: '/api/users/:username/setting/blacklist', // Endpoint
    data: ({url: url, blacklist_type: blacklist_type, blacklist_time: blacklist_time}),
    success: function(data) {console.log("SUCCESS: POSTED BLACKLISTED WEBSITE:  " + data)},
    error: function(err) {console.log("ERROR: COULD NOT POST BLACKLISTED WEBSITES   ")})
  });
}

function getExtension () {
  $.ajax({
    type: 'GET', // GET REQUEST
    url: '/api/users/:username/extension_data', // Endpoint
    success: function(data) {console.log("SUCCESS: OBTAINED ALL EXTENSION DATA: " + data)},
    error: function(err) {console.log("ERROR: COULD NOT GET EXTESION DATA   ")})
  });
}