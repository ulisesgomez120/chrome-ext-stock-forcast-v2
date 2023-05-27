chrome.runtime.onInstalled.addListener((details) => {
  chrome.storage.local.set({ ticker: "", tickerData: {} });
  chrome.contextMenus.create({
    title: "View Stock on Tip Ranks",
    id: "price_target",
    contexts: ["page"],
    documentUrlPatterns: ["https://stockcharts.com/*", "https://finance.yahoo.com/*"],
  });
});

chrome.contextMenus.onClicked.addListener((menu) => {
  navToTipRanks();
});
chrome.runtime.onMessage.addListener((msg, sender, callback) => {
  switch (msg) {
    case "nav_tr":
      navToTipRanks();
      break;
    default:
      break;
  }
});
function navToTipRanks() {
  chrome.storage.local.get(["ticker"], (res) => {
    const ticker = res.ticker;
    if (ticker && ticker[0] !== "$") {
      chrome.tabs.create({
        url: "https://www.tipranks.com/stocks/" + ticker + "/forecast",
      });
    } else {
      chrome.tabs.create({
        url: "https://www.tipranks.com",
      });
    }
  });
}
