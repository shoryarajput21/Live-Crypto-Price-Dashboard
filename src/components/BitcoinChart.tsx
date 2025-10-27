import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  CartesianGrid,
} from "recharts";
import { fetchCoinChart } from "../services/api";
import "./BitcoinChart.css";


type Point = {
  time: string;
  price: number;
};

const BitcoinChart: React.FC<{ coin: string; loading?: boolean }> = ({
  coin,
  loading,
}) => {
  const [data, setData] = useState<Point[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    try {
      setIsLoading(true);
      const d = await fetchCoinChart(coin);
      setData(d);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, [coin]);

  return (
    <div className="chartCard">
      <div className="chartHeader">
        <h3>
          {coin.charAt(0).toUpperCase() + coin.slice(1)} — last 6 hours
        </h3>
        <small>Smooth animated trend</small>
      </div>
      <div className="chartBody">
        {isLoading || loading ? (
          <div className="chartLoader">Loading chart…</div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff7a18" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#ff7a18" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="6 6" strokeOpacity={0.06} />
              <XAxis dataKey="time" minTickGap={30} />
              <YAxis domain={["dataMin", "dataMax"]} />
              <Tooltip
                formatter={(value: number) =>
                  "$" + value.toLocaleString(undefined, { maximumFractionDigits: 2 })
                }
              />
              <Area type="monotone" dataKey="price" stroke="none" fill="url(#grad)" />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#ff7a18"
                strokeWidth={2}
                dot={false}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default BitcoinChart;
