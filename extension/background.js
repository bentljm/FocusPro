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
function updateAppStats(){
  if (alarm.name === "updateApp" && localStorage.auth0_id) {
    var allSites = [];
    for(var prop in gsites.sites) {
      allSites.push({url: prop, time: gsites.sites[prop], freq: 0});
    }
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
}

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