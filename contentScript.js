// input field on stockchart.com -> on a stocks chart page

chrome.runtime.onMessage.addListener(function (msg, sender, callback) {
  // console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
  if (msg === "retry") {
    get_ticker_from_page();
  }
});

function get_ticker_from_page() {
  const stock_charts_ticker = document.getElementById("symbol");
  const yahoo_ticker = document.querySelector("h1");

  if (stock_charts_ticker && !is_empty(stock_charts_ticker.value)) {
    chrome.storage.local.set({ ticker: stock_charts_ticker.value.toUpperCase() });
    chrome.storage.local.get(["ticker_data"], (res) => {
      if (res.ticker_data !== "" && res.ticker_data.ticker.toUpperCase() !== ticker.toUpperCase()) {
        chrome.storage.local.set({ ticker_data: "" });
      }
    });
    chrome.runtime.sendMessage(null, {
      ticker: stock_charts_ticker.value,
      msg: "Ticker saved to local storage",
    });
  } else if (yahoo_ticker && !is_empty(yahoo_ticker.innerText)) {
    // REF: https://finance.yahoo.com/quote/AAPL?p=AAPL&.tsrc=fin-srch
    let text_arr = yahoo_ticker.innerText.split(" ");
    let val = text_arr[text_arr.length - 1].replace(/[\(\)]/g, "");
    chrome.storage.local.set({ ticker: val.toUpperCase() });
    chrome.runtime.sendMessage(null, {
      ticker: val,
      msg: "Ticker saved to local storage",
    });
  } else {
    chrome.storage.local.set({ ticker: "", ticker_data: "" });
  }
}
function is_empty(ele) {
  if (ele === "" || ele === null || ele === undefined) {
    return true;
  }

  return false;
}

get_ticker_from_page();
