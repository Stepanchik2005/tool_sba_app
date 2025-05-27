import React, { useState, useEffect } from "react";

const S_URL = "http://localhost:8080";

export default function MyDetails() {
  const [details, setDetails] = useState([]);
  const [expandedDetailId, setExpandedDetailId] = useState(null);

  useEffect(() => {
    const cached = localStorage.getItem("userDetailHistory");
    if (cached) {
      setDetails(JSON.parse(cached));
      return;
    }

    fetch(`${S_URL}/api/details/history`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDetails(data.data || []);
        localStorage.setItem("userDetailHistory", JSON.stringify(data.data));
      })
      .catch(() => alert("❌ Не вдалося завантажити історію деталей"));
  }, []);

  const toggleDetail = (id) => {
    setExpandedDetailId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <h3>📜 Мої деталі</h3>
      {details.length === 0 && <p>Дані відсутні</p>}
      <ul style={{ padding: 0, listStyle: "none" }}>
        {details.map((detail) => (
          <li
            key={detail.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              marginBottom: "1rem",
              padding: "1rem",
              background: "#f9f9f9",
            }}
          >
            <div
              style={{ cursor: "pointer" }}
              onClick={() => toggleDetail(detail.id)}
            >
              <strong>{detail.name}</strong> — №{detail.number}, {detail.shape},{" "}
              {detail.type}
              <br />
              <small>Замовлення: {detail.orderNumber}</small>
            </div>
            {expandedDetailId === detail.id && (
              <div style={{ marginTop: "1rem" }}>
                <h4>🔍 Атрибути:</h4>
                <ul>
                  {detail.attributes.map((attr, i) => (
                    <li key={i}>
                      {attr.name} — <strong>{attr.value}</strong> {attr.unit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
