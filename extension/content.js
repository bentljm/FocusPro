chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var firstHref = $("a[href^='http']").eq(0).attr("href");

      //This is site url
      console.log(firstHref);

      //Send message to background.js to open a new tab to focusProURL
      var focusProURL = 'https://focuspro.herokuapp.com/';
      chrome.runtime.sendMessage({"message": "open_new_tab", "url": focusProURL});
    }
  }
);