// Notification
// chrome.alarms.create("notificationAlarm", {periodInMinutes: 2});
// chrome.alarms.onAlarm.addListener(function(alarm) {
//   if (alarm.name === "notificationAlarm") {
//     console.log('alarm');
//     chrome.notifications.create('notificationAlarm', {type: 'basic', iconUrl: 'icon128.png', title: 'Notification', message: 'This is a notification!'});
//   }
// });

//Send information to app every hour
chrome.alarms.create("updateApp", {periodInMinutes: 60});
chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === "updateApp" && localStorage.auth0_id) {
    sendAppStats();
  }
});

function sendAppStats() {
  var allSites = [];
  console.log('parsed', JSON.parse(localStorage.sites));
  for(var prop in JSON.parse(localStorage.sites)) {
    allSites.push({url: prop, time: JSON.parse(localStorage.sites)[prop], freq: 0});
  }
  console.log(allSites);
  $.ajax({
    type: 'POST',
    url: `http://localhost:7777/api/users/${localStorage.auth0_id}/extension_data`,
    contentType: 'application/json',
    data: JSON.stringify({ urls:allSites }),
    success: function(data) {
      console.log('success!', data);
    },
    error: function(err) {
      console.log('error', err);
    },
  });
}

// Check blacklist and handle notification cases
// 1 is blackout
// 2 is block after exceeding
// 3 is warn after exceeding

//Check tabs for update
chrome.tabs.onUpdated.addListener(function(tabId, changedInfo, tab) {
  //Strip url
  var match = tab.url.match(/^(\w+:\/\/[^\/]+).*$/);
  if (match) {
    match = match[1];
  }
  for (var i = 0; i < JSON.parse(localStorage.blackout).length; i++) {
    var blackout = JSON.parse(localStorage.blackout)[i];
    if (match === blackout || match === `http://${blackout}` || match === `https://${blackout}`) {
      chrome.tabs.update(tabId, {"url": 'blocked.html'});
    }
  }
});

//Check blacklist every 5 min. For testing purposes, currently set at 1 min
chrome.alarms.create("checkBlacklist", {periodInMinutes: 1});
chrome.alarms.onAlarm.addListener(function(alarm) {
  var block = JSON.parse(localStorage.block);
  var warn = JSON.parse(localStorage.warn);
  var sites = JSON.parse(localStorage.sites);
  if(alarm.name === "checkBlacklist" && (warn.length !== 0 || block.length !== 0)) {
    //Block sites
    //Pseudocode -
    //For each site to track
    //Check if limit exceeded, every 5 min
    //store date of when you first exceeded limit
    //Block the site
    //Set alarm for 24 hours afterwards then reset limit counter
    //Check if limit exceeded
    block.map(function(site) {
      for(var prop in sites) {
        var re = new RegExp(site[0].replace(/www./, '')); //Get rid of www. and make it a new regexp
        if (re.test(prop)) { //Test for a match
          //If match found, check for time spent
          if (sites[prop] > site[1]) {
            //Time has been exceeded
            //Do something
          }
        }
      }
    });



//Track warn sites
//Pseudocode -
//For each site to track
//Check if limit exceeded, every 5 min
//store date of when you first exceeded limit
//Send notification and set alarm for every 30 minute you exceed
//Set alarm for 24 hours afterwards then reset limit counter
//Check if limit exceeded
  }
});

// Clear stats
function clearStats() {
  if (config.clearStatsInterval < 3600) {
    config.nextTimeToClear = 0;
    return;
  }

  if (!config.nextTimeToClear) {
    var d = new Date();
    d.setTime(d.getTime() + config.clearStatsInterval * 1000);
    d.setMinutes(0);
    d.setSeconds(0);
    if (config.clearStatsInterval > 3600) {
      d.setHours(0);
    }
    config.nextTimeToClear = d.getTime();
  }
  var now = new Date();
  if (now.getTime() > config.nextTimeToClear) {
    sites.clear();
    var nextTimeToClear = new Date(nextTimeToClear + config.clearStatsInterval * 1000);
    config.nextTimeToClear = nextTimeToClear.getTime();
    return;
  }
}

var config = new Config();
var sites = new Sites(config);
var tracker = new Tracker(config, sites);

/* Listen for requests which come from the user through the popup. */
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    if (request.action == "clearStats") {
      sites.clear();
      sendResponse({});
    } else if (request.action == "addIgnoredSite") {
      config.addIgnoredSite(request.site);
      sendResponse({});
    } else {
      console.log("Invalid action given: " + request.action);
    }
  });

chrome.alarms.create("clearStats", {periodInMinutes: 2});
chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name == "clearStats") {
    clearStats(config);
  }
});