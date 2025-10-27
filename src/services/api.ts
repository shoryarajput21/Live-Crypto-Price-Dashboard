import axios from "axios";

const BASE = "https://api.coingecko.com/api/v3";

export async function fetchSimplePrices() {
  const url =
    BASE +
    "/simple/price?ids=bitcoin,ethereum,dogecoin&vs_currencies=usd&include_24hr_change=true";
  const res = await axios.get(url);
  return res.data;
}

export async function fetchCoinChart(coin: string) {
  const url = `${BASE}/coins/${coin}/market_chart?vs_currency=usd&days=0.25`;
  const res = await axios.get(url);
  const prices: [number, number][] = res.data.prices || [];
  return prices.map((p) => {
    const d = new Date(p[0]);
    const hh = d.getHours().toString().padStart(2, "0");
    const mm = d.getMinutes().toString().padStart(2, "0");
    return { time: `${hh}:${mm}`, price: Number(p[1].toFixed(2)) };
  });
}
