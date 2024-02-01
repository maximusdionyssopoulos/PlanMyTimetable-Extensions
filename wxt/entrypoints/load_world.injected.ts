export default defineUnlistedScript({
  main() {
    const script = document.createElement("script");
    const handleFromWeb = async (event: MessageEvent) => {
      if (event.data.from === "PlanMyTimetableCapture_") {
        browser.runtime.sendMessage(event.data);
        script.remove();
      }
    };

    window.addEventListener("message", handleFromWeb);

    // load script when loaded

    script.src = browser.runtime.getURL("/load.js");
    document.body.appendChild(script);
  },
});
