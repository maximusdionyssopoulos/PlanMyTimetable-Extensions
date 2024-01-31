export default defineUnlistedScript({
  main() {
    let data;
    const script = document.createElement("script");
    const handleFromWeb = async (event: MessageEvent) => {
      if (event.data.from === "msg.js") {
        data = event.data.data;
        browser.runtime.sendMessage(data);
        script.remove();
      }
    };

    window.addEventListener("message", handleFromWeb);

    // load script when loaded

    script.src = browser.runtime.getURL("/load.js");
    document.body.appendChild(script);
  },
});
