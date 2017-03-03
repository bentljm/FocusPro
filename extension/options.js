var config = new Config();
var sites = new Sites(config);

//Add Auth0id
function addAuth0Id(){
  console.log('clickity click');
  var auth0_input = document.getElementById("auth0_id");
  localStorage.auth0_id = auth0_input.value;
  console.log(localStorage.auth0_id);
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
  restoreOptions();
});