chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "new_tab_activated" ) {
      // window.alert('new tab activated');
      var firstHref = $("a[href^='http']").eq(0).attr("href");

      //This is site url
      console.log('this site is', firstHref);

      //Send message to background.js to open a new tab to focusProURL
      // var focusProURL = 'https://focuspro.herokuapp.com/';
      // chrome.runtime.sendMessage({"message": "open_new_tab", "url": focusProURL});
    }
  }
);
