import React, { useState, useEffect } from "react";
import { S_URL } from "./constants";
//const S_URL = "http://localhost:8080";

export default function MyMachines() {
  const [machines, setMachines] = useState([]);
  const [expandedMachineId, setExpandedMachineId] = useState(null);

  useEffect(() => {
    const cached = localStorage.getItem("userMachineHistory");
    if (cached) {
      setMachines(JSON.parse(cached));
      return;
    }

    fetch(`${S_URL}/api/machines/history`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMachines(data.data || []);
        localStorage.setItem("userMachineHistory", JSON.stringify(data.data));
      })
      .catch(() => alert("❌ Не вдалося завантажити історію станків"));
  }, []);

  const toggleMachine = (id) => {
    setExpandedMachineId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <h3>📜 Мої верстати</h3>
      {machines.length === 0 && <p>Дані відсутні</p>}
      <ul style={{ padding: 0, listStyle: "none" }}>
        {machines.map((machine) => (
          <li
            key={machine.id}
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
              onClick={() => toggleMachine(machine.id)}
            >
              <strong>{machine.model}</strong> — №{machine.workshopNumber},{" "}
              {machine.model}, {machine.inventoryNumber},{machine.chpkSystem}
              <br />
            </div>
            {expandedMachineId === machine.id && (
              <div style={{ marginTop: "1rem" }}>
                <h4>🔍 Атрибути:</h4>
                <ul>
                  {machine.attributes.map((attr, i) => (
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
