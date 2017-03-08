var config = new Config();
var gsites = new Sites(config);

// function sendToApp() {
//   var sendDataBtn = document.createElement("button");
//   var sendDataBtnTxt = document.createTextNode("Send Data");
//   sendDataBtn.appendChild(sendDataBtnTxt);
//   document.body.appendChild(sendDataBtn);
//   sendDataBtn.setAttribute("id", "testButton");
//   sendDataBtn.onclick = function() {
//     // Get all sites and store in array to be parsed and stored in db
//     var allSites = [];
//     for(var prop in gsites.sites) {
//       allSites.push({url: prop, time: gsites.sites[prop], freq: 0});
//     }
//     $.ajax({
//       type: 'POST',
//       url: `http://localhost:7777/api/users/${localStorage.auth0_id}/extension_data`,
//       contentType: 'application/json',
//       data: JSON.stringify({ urls:allSites }),
//       success: function(data) {
//         console.log('success!', data);
//       },
//       error: function(err) {
//         console.log('error', err);
//       },
//     });
//   };
// }

//Add to ignored sites
function addIgnoredSite(new_site) {
  return function() {
    chrome.extension.sendRequest(
       {action: "addIgnoredSite", site: new_site},
       function(response) {
         initialize();
       });
  };
}

//Convert seconds to time in string format
function secondsToString(seconds) {
  if (config.timeDisplayFormat == Config.timeDisplayFormatEnum.MINUTES) {
    return (seconds/60).toFixed(2);
  }
  var years = Math.floor(seconds / 31536000);
  var days = Math.floor((seconds % 31536000) / 86400);
  var hours = Math.floor(((seconds % 31536000) % 86400) / 3600);
  var mins = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
  var secs = (((seconds % 31536000) % 86400) % 3600) % 60;
  var s = "";
  if (years) {
    s = s + " " + years + "y";
  }
  if (days) {
    s = s + " " + days + "d";
  }
  if (hours) {
    s = s + " " + hours + "h";
  }
  if (mins) {
    s = s + " " + mins + "m";
  }
  if (secs) {
    s = s + " " + secs.toFixed(0) + "s";
  }
  return s;
}

//Creates the table display in the popup
function addLocalDisplay() {
  var old_tbody = document.getElementById("stats_tbody");
  var tbody = document.createElement("tbody");
  tbody.setAttribute("id", "stats_tbody");
  old_tbody.parentNode.replaceChild(tbody, old_tbody);

  /* Sort sites by time spent */
  var sites = gsites.sites;
  var sortedSites = [];
  var totalTime = 0;
  for (var site in sites) {
   sortedSites.push([site, sites[site]]);
   totalTime += sites[site];
  }
  sortedSites.sort(function(a, b) {
   return b[1] - a[1];
  });

  /* Show only the top 15 sites by default */
  var max = 15;
  if (document.location.href.indexOf("show=all") != -1) {
   max = sortedSites.length;
  }

  /* Add total row. */
  var row = document.createElement("tr");
  var cell = document.createElement("td");
  cell.innerHTML = "<b>Total</b>";
  row.appendChild(cell);
  cell = document.createElement("td");
  cell.appendChild(document.createTextNode(secondsToString(totalTime)));
  row.appendChild(cell);
  cell = document.createElement("td");
  cell.appendChild(document.createTextNode(("100")));
  row.appendChild(cell);
  row = setPercentageBG(row,0);
  tbody.appendChild(row);

  var maxTime = 0;
  if (sortedSites.length) {
    maxTime = sites[sortedSites[0][0]];
  }
  var relativePct = 0;
  for (var index = 0; ((index < sortedSites.length) && (index < max));
      index++ ){
   var site = sortedSites[index][0];
   row = document.createElement("tr");
   cell = document.createElement("td");
   var removeImage = document.createElement("img");
   removeImage.src = chrome.extension.getURL("images/remove.png");
   removeImage.title = "Remove and stop tracking.";
   removeImage.width = 10;
   removeImage.height = 10;
   removeImage.onclick = addIgnoredSite(site);
   cell.appendChild(removeImage);
   var a = document.createElement('a');
   var linkText = document.createTextNode(site);
   a.appendChild(linkText);
   a.title = "Open link in new tab";
   a.href = site;
   a.target = "_blank";
   cell.appendChild(a);
   row.appendChild(cell);
   cell = document.createElement("td");
   cell.appendChild(document.createTextNode(secondsToString(sites[site])));
   row.appendChild(cell);
   cell = document.createElement("td");
   cell.appendChild(document.createTextNode(
     (sites[site] / totalTime * 100).toFixed(2)));
   relativePct = (sites[site]/maxTime*100).toFixed(2);
   row = setPercentageBG(row,relativePct);
   row.appendChild(cell);
   tbody.appendChild(row);
  }

  /* Show the "Show All" link if there are some sites we didn't show. */
  if (max < sortedSites.length && document.getElementById("show") === null) {
    /* Add an option to show all stats */
    var showAllLink = document.createElement("a");
    showAllLink.onclick = function() {
     chrome.tabs.create({url: "popup.html?show=all"});
    };
    showAllLink.setAttribute("id", "show");
    showAllLink.setAttribute("href", "javascript:void(0)");
    showAllLink.setAttribute("class", "pure-button");
    showAllLink.appendChild(document.createTextNode("Show All"));
    document.getElementById("button_row").appendChild(showAllLink);
  } else if (document.getElementById("show") !== null) {
    var showLink = document.getElementById("show");
    showLink.parentNode.removeChild(showLink);
  }
}

function setPercentageBG(row,pct) {
  var color = "#e8edff";
  row.style.backgroundImage = "-webkit-linear-gradient(left, "+color+" "+pct+"%,#ffffff "+pct+"%)";
  row.style.backgroundImage = "    -moz-linear-gradient(left, "+color+" "+pct+"%, #ffffff "+pct+"%)";
  row.style.backgroundImage = "     -ms-linear-gradient(left, "+color+" "+pct+"%,#ffffff "+pct+"%)";
  row.style.backgroundImage = "      -o-linear-gradient(left, "+color+" "+pct+"%,#ffffff "+pct+"%)";
  row.style.backgroundImage = "         linear-gradient(to right, "+color+" "+pct+"%,#ffffff "+pct+"%)";
  return row;
}

function sendStats() {
  chrome.extension.sendRequest({action: "sendStats"}, function(response) {
   /* Reload the iframe. */
   var iframe = document.getElementById("stats_frame");
   iframe.src = iframe.src;
  });
}

function clearStats() {
  chrome.extension.sendRequest({action: "clearStats"}, function(response) {
   initialize();
  });
}

function initialize() {
  addLocalDisplay();
  //sendToApp();

  if (config.lastClearTime) {
    var div = document.getElementById("lastClear");
    if (div.childNodes.length == 1) {
      div.removeChild(div.childNodes[0]);
    }
    div.appendChild(
      document.createTextNode("Last Reset: " + new Date(
        config.lastClearTime).toString()));
  }

  var nextClearStats = config.nextTimeToClear;
  if (nextClearStats) {
   nextClearStats = parseInt(nextClearStats, 10);
   nextClearStats = new Date(nextClearStats);
   var nextClearDiv = document.getElementById("nextClear");
   if (nextClearDiv.childNodes.length == 1) {
     nextClearDiv.removeChild(nextClearDiv.childNodes[0]);
   }
   nextClearDiv.appendChild(
     document.createTextNode("Next Reset: " + nextClearStats.toString()));
  }
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("clear").addEventListener("click",
    function() { if (confirm("Are you sure?")) { clearStats(); }});
  document.getElementById("options").addEventListener("click",
      function() { chrome.runtime.openOptionsPage(); });
  var buttons = document.querySelectorAll("button");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function(e) {
      _gaq.push(["_trackEvent", e.target.id, "clicked"]);
    });
  }
  initialize();
});