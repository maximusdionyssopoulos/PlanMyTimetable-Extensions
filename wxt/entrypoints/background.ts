export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });
  // browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  //   console.log(sender);

  //   console.log(message);
  // });
});
