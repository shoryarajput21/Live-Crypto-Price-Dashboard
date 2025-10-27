import React, { useEffect, useState } from "react";
import "./CryptoCard.css";

type Props = {
  name: string;
  symbol: string;
  price: number;
  change: number;
  color: "bitcoin" | "ethereum" | "dogecoin";
  loading?: boolean;
  active?: boolean;
  onClick?: () => void;
};

function formatPrice(p: number) {
  if (p >= 1)
    return p.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });
  return p.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 6,
  });
}

const CryptoCard: React.FC<Props> = ({
  name,
  symbol,
  price,
  change,
  color,
  loading,
  active,
  onClick,
}) => {
  const [prev, setPrev] = useState(price);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!loading && price !== prev) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 700);
      setPrev(price);
      return () => clearTimeout(t);
    }
  }, [price, loading, prev]);

  const up = change >= 0;

  return (
    <div
      className={`card ${color} ${pulse ? "pulse" : ""} ${
        active ? "active" : ""
      }`}
      role="article"
      onClick={onClick}
    >
      <div className="cardInner">
        <div className="cardHeader">
          <div className="symbol">{symbol}</div>
          <div className="name">{name}</div>
        </div>

        <div className="priceRow">
          <div className="price">
            {loading ? <div className="dotLoader" /> : formatPrice(price)}
          </div>
          <div className={`change ${up ? "pos" : "neg"}`}>
            {loading ? "—" : change.toFixed(2) + "%"}
          </div>
        </div>

        <div className="cardFooter">
          <small>24h</small>
        </div>
      </div>
    </div>
  );
};

export default CryptoCard;
