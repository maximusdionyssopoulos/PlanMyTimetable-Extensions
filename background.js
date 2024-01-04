chrome.tabs.onActivated.addListener(updateBadge);

function updateBadge() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs && tabs.length > 0) {
      const currentTab = tabs[0];
      const url = currentTab.url;
      console.log(url);
      if (url.startsWith(extensions)) {
        chrome.action.setBadgeText({
          text: "GET",
        });
      } else {
        chrome.action.setBadgeText({
          text: "",
        });
      }
    }
  });
}

const extensions = "https://mytimetable";
function addBookmarklet() {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("bookmarklet.js");
  document.body.appendChild(script);
}

// When the user clicks on the extension action
chrome.action.onClicked.addListener((tab) => {
  if (tab.url.startsWith(extensions)) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: addBookmarklet,
    });
  }
});
