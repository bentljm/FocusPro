//TODO: Force refresh when starting to block
//Change options view so only original warn time is showing

//Clearing data
//Clear data every 24 hours at midnight
//chrome.alarms.create("midnightClearStats", {when: new Date().setHours(0), periodInMinutes: 1440});
//Clear all notifications every 24 hours at midnight
chrome.alarms.create("clearNotifications", {when: new Date().setHours(0), periodInMinutes: 1440});

//For testing:
//chrome.alarms.create("clearNotifications", {periodInMinutes: 1});

//Send information to app every half hour
//TEMP 1
chrome.alarms.create("updateApp", {periodInMinutes: 1});

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === "updateApp" && localStorage.auth0_id) {
    console.log('sending stats!');
    sendAppStats();

  } else if (alarm.name === "clearNotifications") {
    var warn = JSON.parse(localStorage.warn);
    var sites = JSON.parse(localStorage.sites);
    //Replace all warn[i][1] with original warn[i][1] + time spent on it
    for(var i = 0; i < warn.length; i++){
      var siteTime = sites[`http://${warn[i][0]}`] || sites[`https://${warn[i][0]}`];
      warn[i][1] = warn[i][1] + siteTime;
    }
    console.log('update warn time');
    localStorage.warn = JSON.stringify(warn);
  }
  // if (alarm.name === "midnightClearStats") {
  //   console.log('now clearing stats');
  //   var oldSites = new Sites(config);
  //   oldSites.clear();
  // }
});

function sendAppStats() {
  var allSites = [];
  var blacklist = JSON.parse(localStorage.blacklist);
  for(var prop in JSON.parse(localStorage.sites)) {
    //Store history for prop in array
    var history = [];
    //Check if site matches a blacklisted site
    for (var i = 0; i < blacklist.length; i++) {
      var re = new RegExp(blacklist[i]['url'].replace(/www./, ''));
      if (re.test(prop)) {
        console.log('blacklist site found!', prop);
        //If it matches, check if there's already history information stored
        if (blacklist[i]['history']) {
          console.log('adding to history', blacklist[i]['history']);
          //Push [Date, time spent] to blacklist history and to history to be sent
          blacklist[i]['history'].push([Date.now().toString(), JSON.parse(localStorage.sites)[prop].toString()]);
          history = blacklist[i]['history'];
        } else {
          console.log('starting history');
          //If it matches and no existing history, create empty array
          blacklist[i]['history'] = [];
        }
        //Update blacklist
        localStorage.blacklist = JSON.stringify(blacklist);
      }
    }
    allSites.push({url: prop, time: JSON.parse(localStorage.sites)[prop], history: history});
  }
  console.log(JSON.stringify(allSites));
  $.ajax({
    type: 'POST',
    url: `http://localhost:7777/api/users/${localStorage.auth0_id}/extension_data`,
    contentType: 'application/json',
    data: JSON.stringify({ urls:allSites }),
    success: function() {
      console.log('success!');
    },
    error: function(err) {
      console.log('error', err);
    },
  });
}

// Check blacklist and handle notification cases
//BLACKOUT CASE
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

//Check blacklist every 5 min.
chrome.alarms.create("checkBlacklist", {periodInMinutes: 5});
chrome.alarms.onAlarm.addListener(function(alarm) {
  var block = JSON.parse(localStorage.block);
  var warn = JSON.parse(localStorage.warn);
  var sites = JSON.parse(localStorage.sites);
  var blackout = JSON.parse(localStorage.blackout);
  if(alarm.name === "checkBlacklist" && (warn.length !== 0 || block.length !== 0)) {
    //BLOCK CASE
    block.map(function(site) { //for each site in blacklist to block
      for(var prop in sites) { //Compare site with prop in sites you have visited
        var re = new RegExp(site[0].replace(/www./, '')); //Get rid of www. and make it a new regexp
        if (re.test(prop)) { //Test for a match
          //If match found, check for time spent
          if ((sites[prop]/60) > site[1]) {
            //Check if already blocking
            if (JSON.parse(localStorage.blackout).indexOf(site[0]) === -1) {
              //Time has been exceeded
              //Create an alarm that will notify when 24 hr block has ended (1440 min)
              chrome.alarms.create(`block${site[0]}`, {delayInMinutes: 1440});
              //Add the site to blackout
              console.log('Alarm created, now blocking!', site[0]);
              blackout.push(site[0]);
              localStorage.blackout = JSON.stringify(blackout);
            }
          }
        }
      }
    });
    //WARNING CASE
    warn.map(function(site) {
      //site[url, time limit, time since last exceeded]
      for(var prop in sites) {
        var re = new RegExp(site[0].replace(/www./, ''));
        if (re.test(prop)) {
          if ((sites[prop]/60) > site[1]) {
          //Time exceeded
          //Check if warned before
            if (site.length === 3) {
              //Check if need to warn now (Check every 10 minutes)
              var diff = (sites[prop]/60) - site[2];
              if (diff > 10) {
                //Send notification
                chrome.alarms.create(`notificationWarning${site[0]}`, {when: 0});
                console.log('TIME LIMIT EXCEEDED. THIS IS A NOTIFICATION', site);
                //Update last notified time site[2]
                site[2] = (sites[prop]/60);
              }
            } else {
              site.push(sites[prop]/60);
              //Send notification
              chrome.alarms.create(`notificationWarning${site[0]}`, {when: 0});
              console.log('FIRST TIME. TIME LIMIT EXCEEDED. THIS IS A NOTIFICATION', site);
            }
          }
        }
      }
    });
    localStorage.warn = JSON.stringify(warn);
  }
});

//Listener for when to unblock
chrome.alarms.onAlarm.addListener(function(alarm) {
  if(alarm.name.includes("block")) {
    var site = alarm.name.replace("block", ""); //Get site name
    var blackout = JSON.parse(localStorage.blackout);
    console.log('Time to unblock', site);
    blackout = blackout.filter((e) => {
      return !e.includes(site); //Filter out that site
    });
    localStorage.blackout = JSON.stringify(blackout);
    chrome.alarms.clear(`block${site}`);
    //Clear alarm after unblocking
  }
});

//Listener for sending notification
chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name.includes("notificationWarning")) {
    var site = alarm.name.replace("notificationWarning", "");
    //Check if on site or not, don't send notification if not currently on site
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      var url = tabs[0].url.match(/^(\w+:\/\/[^\/]+).*$/)[1];
      url = url.replace(/https?:\/\//, "");
      console.log('notification sent');
      if (site.includes(url)) {
        chrome.notifications.create('notificationAlarm', {type: 'basic', iconUrl: 'icon128.png', title: 'Notification', message: `You have exceeded the time set for ${site}. Are you being productive towards your goal?`});
      }
    });
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