export default defineUnlistedScript({
  main() {
    let data;
    const handleFromWeb = async (event: MessageEvent) => {
      if (event.data.from === "msg.js") {
        data = event.data.data;
        browser.runtime.sendMessage(data);
      }
    };

    window.addEventListener("message", handleFromWeb);

    // load script on

    const script = document.createElement("script");
    script.src = browser.runtime.getURL("/load.js");
    document.body.appendChild(script);
  },
});
