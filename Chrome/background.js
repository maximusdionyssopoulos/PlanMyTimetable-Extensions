chrome.tabs.onActivated.addListener(updateBadge);
chrome.tabs.onUpdated.addListener(updateBadge);
chrome.action.setBadgeBackgroundColor({ color: "#4ade80" });

function updateBadge() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs && tabs.length > 0) {
      const currentTab = tabs[0];
      const url = currentTab.url;
      console.log(url);
      if (url.startsWith(extensions)) {
        chrome.action.setIcon({
          path: {
            48: "images/icon48.png",
            96: "images/icon48@2x.png",
            128: "images/icon128.png",
            256: "images/icon128@2x.png",
          },
        });
        chrome.action.setBadgeText({
          text: "+",
        });
      } else {
        chrome.action.setIcon({
          path: {
            48: "images/icon48-deactive.png",
            96: "images/icon48-deactive@2x.png",
            128: "images/icon128-deactive.png",
            256: "images/icon128-deactive@2x.png",
          },
        });
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
