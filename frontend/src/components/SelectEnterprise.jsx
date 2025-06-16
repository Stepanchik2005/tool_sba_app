import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { S_URL } from "./constants";

export default function SelectEnterprise({ onCompleted }) {
  const [enterprises, setEnterprises] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [customName, setCustomName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Токен:", token); // ➕ додай сюди
    fetch(`${S_URL}/api/enterprise/getAll`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setEnterprises(data))
      .catch((err) => console.error("Помилка завантаження підприємств:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (customName.trim()) {
      // Створити нове підприємство
      fetch(`${S_URL}/api/enterprise/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: customName.trim() }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Не вдалося створити підприємство");
          return res.json();
        })
        .then(() => onCompleted())
        .catch((err) => {
          alert(err.message);
          console.error("Помилка створення:", err);
        });
    } else if (selectedId) {
      // Прив’язати до існуючого
      fetch(`${S_URL}/api/user/set/enterprise?enterpriseId=${selectedId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Не вдалося прив'язати підприємство");
          onCompleted();
        })
        .catch((err) => {
          alert(err.message);
          console.error("Помилка отримання:", err);
        });
    } else {
      alert("Оберіть підприємство або введіть нову назву.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", paddingTop: "2rem" }}>
      <h2>Оберіть або створіть підприємство</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <select
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            setCustomName("");
          }}
        >
          <option value="">-- Оберіть підприємство --</option>
          {enterprises.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>

        <div>Або введіть нову назву:</div>
        <input
          type="text"
          placeholder="Нова назва підприємства"
          value={customName}
          onChange={(e) => {
            setCustomName(e.target.value);
            setSelectedId("");
          }}
        />

        <button type="submit">Підтвердити</button>
      </form>
    </div>
  );
}
