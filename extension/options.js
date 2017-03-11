var config = new Config();
var sites = new Sites(config);

function reload() {
  window.location.reload();
}
//Blacklist display
function displayBlacklist() {
  //console.log('localStorage.blackout',localStorage.blackout);
  if ((localStorage.blackout)) {
    var blackout = JSON.parse(localStorage.blackout);
    blackout = blackout.filter(e => e);
    for(var i = 0; i < blackout.length; i++) {
      var url = document.createTextNode(blackout[i]);
      var list = document.getElementById("blackout_display");
      list.appendChild(url);
      list.appendChild(document.createElement("br"));
    }
  }
  if ((localStorage.block)) {
    var block = JSON.parse(localStorage.block);
    block = block.filter(e => e);
    for(var i = 0; i < block.length; i++) {
      var url = document.createTextNode(block[i][0]);
      var time = document.createTextNode(` after exceeding ${block[i][1]} minutes`);
      var table = document.getElementById("block_display");
      table.appendChild(url);
      table.appendChild(time);
      table.appendChild(document.createElement("br"));
    }
  }
  if ((localStorage.warn)) {
    var warn = JSON.parse(localStorage.warn);
    warn = warn.filter(e => e);
    for(var i = 0; i < warn.length; i++) {
      var url = document.createTextNode(warn[i][0]);
      var time = document.createTextNode(` after exceeding ${warn[i][1]} minutes`);
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
    url: `/api/users/${localStorage.auth0_id}/blacklist`,
    success: function(data) {
      //console.log('SUCCESS: OBTAINED BLACKLIST: ', data.data);
      //Create list of blacklist urls
      var newList = [];
      data.data.forEach(function(e) {newList.push(e.url);});
      var blacklist = localStorage.blacklist ? JSON.parse(localStorage.blacklist) : [];
      var oldSites = [];
      blacklist.forEach(function(e) {oldSites.push(e.url);});
      //Filter out any blacklist sites that were removed
      blacklist = blacklist.filter(function(e) {
        return (newList.indexOf(e.url) !== -1);
      });
      //Add new sites to blacklist
      data.data.forEach(function(e) {
        if (oldSites.indexOf(e.url) === -1) {
          blacklist.push(e);
        }
      });
      //console.log('blacklist', blacklist);
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
      localStorage.blackout = JSON.stringify(blackout.filter(e => e)); //[url, url, url]
      localStorage.block = JSON.stringify(block.filter(e => e)); //[[url, time], [url, time]]
      localStorage.warn = JSON.stringify(warn.filter(e => e)); //[[url, time, lastWarned], [url, time, lastWarned]]
      localStorage.blacklist = JSON.stringify(blacklist.filter(e => e)); //[{}]
      //console.log('localStorage', localStorage.blackout, localStorage.block, localStorage.warn);
      reload();
    },
    error: function(err) {
      //console.log('error', err);
    },
  });
}

//Update the interval to clear stats
// function updateClearStatsInterval() {
//   var select = document.getElementById("clear_stats_interval");
//   var option = select.options[select.selectedIndex];
//   config.clearStatsInterval = option.value;
//   restoreOptions();
// }

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

  // var clearStatsInterval = config.clearStatsInterval;
  // select = document.getElementById("clear_stats_interval");
  // for (var i = 0; i < select.options.length; i++) {
  //   var option = select.options[i];
  //   if (option.value == clearStatsInterval) {
  //     option.selected = true;
  //     break;
  //   }
  // }

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
  // document.getElementById("clear_stats_interval").addEventListener(
  //   "change", updateClearStatsInterval);
  // document.getElementById("time_display").addEventListener(
  //   "change", updateTimeDisplay);
  document.getElementById("download").addEventListener(
    "click", download);
  document.getElementById("add_auth0_id").addEventListener(
    "click", addAuth0Id);
  document.getElementById("update_blacklist").addEventListener(
    "click", updateBlacklist);
  restoreOptions();
});