browser.tabs.onActivated.addListener(updateBadge);

function updateBadge() {
  browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs && tabs.length > 0) {
      const currentTab = tabs[0];
      const url = currentTab.url;
      if (url.startsWith(extensions)) {
        browser.action.setBadgeText({
          text: "GET",
        });
      } else {
        browser.action.setBadgeText({
          text: "",
        });
      }
    }
  });
}

const extensions = "https://mytimetable";
function addBookmarklet() {
  const script = document.createElement("script");
  script.src = browser.runtime.getURL("bookmarklet.js");
  document.body.appendChild(script);
}

// When the user clicks on the extension action
browser.action.onClicked.addListener((tab) => {
  if (tab.url.startsWith(extensions)) {
    browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: addBookmarklet,
    });
  }
});
