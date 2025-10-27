import React, { useEffect, useState } from "react";
import CryptoCard from "./components/CryptoCard";
import BitcoinChart from "./components/BitcoinChart";
import { fetchSimplePrices } from "./services/api";
import "./App.css";

type Prices = {
  bitcoin?: { usd: number; usd_24h_change: number };
  ethereum?: { usd: number; usd_24h_change: number };
  dogecoin?: { usd: number; usd_24h_change: number };
};

function App() {
  const [prices, setPrices] = useState<Prices | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [activeCoin, setActiveCoin] = useState<"bitcoin" | "ethereum" | "dogecoin">("bitcoin");

  const load = async () => {
    try {
      const data = await fetchSimplePrices();
      setPrices(data);
      setLastUpdated(Date.now());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">
          🚀 <span>Live Crypto Price Dashboard</span>
        </h1>
        <p className="subtitle">Real-time prices — updates every 30 seconds</p>
      </header>

      <main className="main">
        <section className="cards">
          <CryptoCard
            name="Bitcoin"
            symbol="BTC"
            color="bitcoin"
            price={prices?.bitcoin?.usd ?? 0}
            change={prices?.bitcoin?.usd_24h_change ?? 0}
            loading={loading}
            active={activeCoin === "bitcoin"}
            onClick={() => setActiveCoin("bitcoin")}
          />
          <CryptoCard
            name="Ethereum"
            symbol="ETH"
            color="ethereum"
            price={prices?.ethereum?.usd ?? 0}
            change={prices?.ethereum?.usd_24h_change ?? 0}
            loading={loading}
            active={activeCoin === "ethereum"}
            onClick={() => setActiveCoin("ethereum")}
          />
          <CryptoCard
            name="Dogecoin"
            symbol="DOGE"
            color="dogecoin"
            price={prices?.dogecoin?.usd ?? 0}
            change={prices?.dogecoin?.usd_24h_change ?? 0}
            loading={loading}
            active={activeCoin === "dogecoin"}
            onClick={() => setActiveCoin("dogecoin")}
          />
        </section>

        <section className="chartWrap">
          <BitcoinChart coin={activeCoin} loading={loading} />
        </section>
      </main>

      <footer className="footer">
        © 2025 | Developed by Shorya Rajput
        {lastUpdated && (
          <span className="updated">
            • Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        )}
      </footer>
    </div>
  );
}

export default App;
