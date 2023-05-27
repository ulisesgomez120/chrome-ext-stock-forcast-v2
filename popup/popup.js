import { get_ele, reset_ui, capitalize, get_ticker_data, loading_ui, is_empty } from "../utils/helper.js";

//
function build_ui(json) {
  // json = {
  //   ticker: result.ticker,
  //   price_target: 0,
  //   price_percentage: 0,
  //   header_concensus_rating_count: 0,
  //   header_concensus_rating: "",
  //   success: true
  // };
  get_ele(".skeleton").forEach((ele) => ele.classList.remove("skeleton"));
  if (!json.success) {
    reset_ui();
    chrome.storage.local.set({ ticker_data: "" });
    return;
  }
  let ele = null;
  let val = null;
  for (let key in json) {
    ele = get_ele("#" + key);

    switch (key) {
      case "ticker":
        ele.textContent = json["ticker"] ? json["ticker"].toUpperCase() : "---";
        break;
      case "price_target":
        ele.textContent = json["price_target"] ? "$" + json["price_target"] : "--";
        break;
      case "price_percentage":
        val = json["price_percentage"];
        let msg = "%";
        if (val < 0) {
          msg = "% Downside";
          let price = get_ele("#price");
          let rating = get_ele("#ratings");
          price.classList.remove("upside");
          price.classList.add("downside");
          rating.classList.remove("upside");
          rating.classList.add("downside");
        } else if (val > 0) {
          msg = "% Upside";
          let price = get_ele("#price");
          let rating = get_ele("#ratings");
          price.classList.remove("downside");
          price.classList.add("upside");
          rating.classList.remove("downside");
          rating.classList.add("upside");
        }
        ele.textContent = json["price_percentage"] ? json["price_percentage"] + msg : "---";
        break;
      case "header_concensus_rating":
        val = null;
        if (is_empty(json[key])) {
          val = "---";
        } else if (json[key] && json[key].toLowerCase().startsWith("strong")) {
          val = "Strong " + capitalize(json[key].substring(6));
        } else {
          val = capitalize(json[key]);
        }
        ele.textContent = val;
        break;
      case "header_concensus_rating_count":
        ele.textContent = json[key] ? json[key] + " ratings" : "---";
        break;
    }
  }
  chrome.storage.local.set({ ticker_data: json });
}
function handleMessage(msg) {
  if (!msg.ticker) {
    return;
  }
  if (msg.ticker.includes("$") || msg.ticker === "") {
    reset_ui();
    chrome.storage.local.set({ ticker_data: "" });
    return;
  } else {
    if (msg.ticker) {
      chrome.storage.local.get(["ticker_data"], (res) => {
        if (res.ticker_data.ticker === msg.ticker) {
          build_ui(res.ticker_data);
        } else {
          get_ticker_data(msg.ticker)
            .then((data) => {
              build_ui(data);
            })
            .catch((err) => console.log(err));
        }
      });
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  get_ele("#retry_search", "click", async function () {
    loading_ui();
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    chrome.tabs.sendMessage(tab.id, "retry");
  });
  get_ele("#tipranks_nav", "click", function () {
    chrome.runtime.sendMessage(null, "nav_tr");
  });
  // get ele replaces below
  // const tr_nav = document.querySelector("#tipranks_nav");
  // tr_nav.addEventListener("click", function () {
  //   chrome.runtime.sendMessage(null, "nav_tr");
  // });
  chrome.runtime.onMessage.addListener(handleMessage);
  chrome.storage.local.get(["ticker", "ticker_data"], (res) => {
    const { ticker, ticker_data } = res;
    if (ticker.includes("$") || ticker === "") {
      console.log("storage get: " + ticker);
      reset_ui();
      chrome.storage.local.set({ ticker_data: "" });
      return;
    } else {
      if (ticker_data?.ticker === ticker) {
        build_ui(ticker_data);
      } else {
        get_ticker_data(ticker)
          .then((data) => {
            build_ui(data);
          })
          .catch((err) => console.log(err));
      }
    }
  });
});
