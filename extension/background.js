// // Called when the user clicks on the browser action.
// chrome.browserAction.onClicked.addListener(function(tab) {
//   // Send a message to the active tab
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     var activeTab = tabs[0];
//     chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
//   });
// });

// // Listen for open new tab request to create a tab to focusProUrl
// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     if( request.message === "open_new_tab" ) {
//       chrome.tabs.create({"url": request.url});
//     }
//   }
// );


//When clicked, create a new tab to FocusPro site
chrome.browserAction.onClicked.addListener(function(){
  var focusProURL = 'https://focuspro.herokuapp.com/';
  chrome.tabs.create({"url": focusProURL});
});

//Call when active tab in window changes
chrome.tabs.onActivated.addListener(function(tab) {
  //tab contains object: id of the tab that was made active and id of its window
  //Send info "to content to console log
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "new_tab_activated"});
  });
  // chrome.tabs.sendMessage(tab.id, {"message": "new_tab_activation"});
});