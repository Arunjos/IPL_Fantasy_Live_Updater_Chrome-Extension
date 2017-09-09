chrome.tabs.onUpdated.addListener(function(tabId , info) {
  if (info.status == "complete") {
    //alert("Loaded Completed");
  }
});
