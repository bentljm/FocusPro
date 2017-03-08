var config = new Config();
var sites = new Sites(config);
//Blacklist display
function displayBlacklist() {
  console.log('ls is', JSON.parse(localStorage.blackout));
  if (localStorage.blackout) {
    for(var i = 0; i < JSON.parse(localStorage.blackout).length; i++) {
      var url = document.createTextNode(JSON.parse(localStorage.blackout)[i]);
      var list = document.getElementById("blackout_display");
      list.appendChild(url);
      list.appendChild(document.createElement("br"));
    }
    for(var i = 0; i < JSON.parse(localStorage.block).length; i++) {
      var url = document.createTextNode(JSON.parse(localStorage.block)[i][0]);
      var time = document.createTextNode(` after exceeding ${JSON.parse(localStorage.block)[i][1]} minutes`);
      var table = document.getElementById("block_display");
      table.appendChild(url);
      table.appendChild(time);
      table.appendChild(document.createElement("br"));
    }
    for(var i = 0; i < JSON.parse(localStorage.warn).length; i++) {
      var url = document.createTextNode(JSON.parse(localStorage.warn)[i][0]);
      var time = document.createTextNode(` after exceeding ${JSON.parse(localStorage.warn)[i][1]} minutes`);
      var table = document.getElementById("warn_display");
      table.appendChild(url);
      table.appendChild(time);
      table.appendChild(document.createElement("br"));
    }
  }
}

//Display Auth0Id
function displayAuth() {
  if (localStorage.auth0_id) {
    document.getElementById("auth0_id").placeholder = localStorage.auth0_id;
  }
}
//Add Auth0id and get blacklist
function addAuth0Id(){
  var auth0_input = document.getElementById("auth0_id");
  localStorage.auth0_id = auth0_input.value;
  updateBlacklist();
}

//Update blacklist
function updateBlacklist(){
  $.ajax({
    type: 'GET',
    url: `http://localhost:7777/api/users/${localStorage.auth0_id}/blacklist`,
    success: function(data) {
      console.log('SUCCESS: OBTAINED BLACKLIST: ', data.data);
      localStorage.blacklist = JSON.stringify(data.data);
      // Store all sites to blackout inside localStorage.blackout
      // Store all sites to block after certain time inside localStorage.block
      // Store all sites to warn after certain time inside localStorage.warn
      var blackout = [];
      var block = [];
      var warn = [];
      for (var i = 0; i < data.data.length; i++) {
        //Strip url
        var match = data.data[i].url.match(/^(\w+:\/\/[^\/]+).*$/);
        if (match) {
          match = match[1];
        } else {
          match = data.data[i].url;
        }
        match = match.replace(/(https?:\/\/)/, "");
        if (data.data[i].blacklist_type === "1") {
          blackout.push(match);
        } else if (data.data[i].blacklist_type === "2") {
          block.push([match, data.data[i].blacklist_time]);
        } else {
          warn.push([match, data.data[i].blacklist_time]);
        }
      }
      localStorage.blackout = JSON.stringify(blackout); //[url, url, url]
      localStorage.block = JSON.stringify(block); //[[url, time], [url, time]]
      localStorage.warn = JSON.stringify(warn); //[[url, time, lastWarned], [url, time, lastWarned]]
      console.log('localStorage', localStorage.blackout, localStorage.block, localStorage.warn);
    },
    error: function(err) {
      console.log('error', err);
    },
  });
}

//Update the interval to clear stats
function updateClearStatsInterval() {
  var select = document.getElementById("clear_stats_interval");
  var option = select.options[select.selectedIndex];
  config.clearStatsInterval = option.value;
  restoreOptions();
}

//Upate the format of time display
function updateTimeDisplay() {
  var select = document.getElementById("time_display");
  var option = select.options[select.selectedIndex];
  config.timeDisplayFormat = option.value;
  restoreOptions();
}

//Add an ignored site
function addIgnoredSite() {
  var newSite = document.getElementById("new_ignored_site").value;
  if (newSite.indexOf("http://") !== 0 && newSite.indexOf("https://") !== 0) {
    alert("Include http:// or https:// prefix.");
    return;
  }

  chrome.extension.sendRequest(
     {action: "addIgnoredSite", site: newSite},
     function(response) {
       restoreOptions();
     });
}

//Remove ignored sites
function removeIgnoredSites() {
  var select = document.getElementById("ignored_sites");
  var ignoredSites = [];
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.selected === false) {
      ignoredSites.push(child.value);
    }
  }
  localStorage.ignoredSites = JSON.stringify(ignoredSites);
  restoreOptions();
}

// Restores options from localStorage, if available.
function restoreOptions() {
  var ignoredSites = localStorage.ignoredSites;
  if (!ignoredSites) {
    return;
  }
  ignoredSites = JSON.parse(ignoredSites);
  var select = document.getElementById("ignored_sites");
  select.options.length = 0;
  for (var i in ignoredSites) {
    var option = document.createElement("option");
    option.text = ignoredSites[i];
    option.value = ignoredSites[i];
    select.appendChild(option);
  }

  var clearStatsInterval = config.clearStatsInterval;
  select = document.getElementById("clear_stats_interval");
  for (var i = 0; i < select.options.length; i++) {
    var option = select.options[i];
    if (option.value == clearStatsInterval) {
      option.selected = true;
      break;
    }
  }

  var timeDisplay = config.timeDisplayFormat;
  select = document.getElementById("time_display");
  for (var i = 0; i < select.options.length; i++) {
    var option = select.options[i];
    if (option.value == timeDisplay) {
      option.selected = true;
      break;
    }
  }
}

//Creates csv file
function download() {
  var csvContent = "data:text/csv;charset=utf-8,";
  var sitesDict = sites.sites;
  var pairs = [];
  for (var site in sitesDict) {
    if (sitesDict.hasOwnProperty(site)) {
      pairs.push(site + "," + sitesDict[site]);
    }
  }
  csvContent += pairs.join("\n");
  window.open(encodeURI(csvContent));
}

//Add event listeners
document.addEventListener("DOMContentLoaded", function () {
  displayAuth();
  displayBlacklist();
  document.getElementById("add_ignored").addEventListener(
    "click", addIgnoredSite);
  document.getElementById("remove_ignored").addEventListener(
    "click", removeIgnoredSites);
  document.getElementById("clear_stats_interval").addEventListener(
    "change", updateClearStatsInterval);
  document.getElementById("time_display").addEventListener(
    "change", updateTimeDisplay);
  document.getElementById("download").addEventListener(
    "click", download);
  document.getElementById("add_auth0_id").addEventListener(
    "click", addAuth0Id);
  document.getElementById("update_blacklist").addEventListener(
    "click", updateBlacklist);
  restoreOptions();
});