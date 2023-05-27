export function capitalize(str) {
  if (typeof str === "string") {
    return str[0].toUpperCase() + str.substring(1);
  }
}
export function get_ele(selector, event, event_callback) {
  let matches = document.querySelectorAll(selector);
  if (matches.length > 0) {
    if (event !== null || event !== undefined) {
      matches.forEach((ele) => ele.addEventListener(event, event_callback));
    }
    if (selector.startsWith("#")) {
      matches = matches[0];
    }
  }

  return matches;
}
export async function get_ticker_data(ticker) {
  if (!ticker || typeof ticker !== "string") {
    throw new Error("ticker must be a string in get_ticker_data");
  }

  const res = await fetch("http://54.167.125.17/" + ticker);
  if (!res.ok) {
    console.log(res);
    throw new Error("Ticker not found");
  }
  const data = await res.json();
  return data;
}
export function loading_ui() {
  let skel_ele = null;

  get_ele("#ticker").textContent = "--";
  get_ele("#price_percentage").textContent = "";
  get_ele("#price_target").textContent = "";
  get_ele("#header_concensus_rating").textContent = "";
  get_ele("#header_concensus_rating_count").textContent = "";

  ["#price", "#ratings"].forEach((id) => {
    skel_ele = get_ele(id);
    skel_ele.classList.add("skeleton");
    skel_ele.classList.remove("upside", "downside");
  });
}
export function reset_ui() {
  get_ele(".skeleton").forEach((ele) => ele.classList.remove("skeleton"));
  get_ele("#ticker").textContent = "--";
  get_ele("#price_percentage").textContent = "Not Found. Visit the site by clicking the link below";
  get_ele("#price_target").textContent = "--";
  get_ele("#header_concensus_rating").textContent = "--";
  get_ele("#header_concensus_rating_count").textContent = "--";
  get_ele("#price").classList.remove("upside", "downside");
  get_ele("#ratings").classList.remove("upside", "downside");
}
export function is_empty(ele) {
  if (ele === "" || ele === null || ele === undefined) {
    return true;
  }

  return false;
}
