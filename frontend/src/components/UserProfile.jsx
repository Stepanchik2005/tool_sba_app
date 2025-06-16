import React, { useEffect, useState } from "react";

export default function EnterpriseForm({ onSubmit }) {
  const [enterprises, setEnterprises] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [customName, setCustomName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/enterprise/getAll")
      .then((res) => res.json())
      .then((data) => {
        setEnterprises(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Помилка завантаження підприємств:", err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (customName.trim()) {
      onSubmit({ name: customName.trim() });
    } else if (selectedId) {
      onSubmit({ enterpriseId: selectedId });
    } else {
      alert("Оберіть підприємство або введіть нову назву.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <label>
        Оберіть підприємство зі списку:
        <select
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            setCustomName(""); // очистити ручне поле
          }}
        >
          <option value="">-- Не обрано --</option>
          {enterprises.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
      </label>

      <div>Або введіть нову назву підприємства:</div>
      <input
        type="text"
        placeholder="Нова назва підприємства"
        value={customName}
        onChange={(e) => {
          setCustomName(e.target.value);
          setSelectedId(""); // очистити випадаючий список
        }}
      />

      <button type="submit">Підтвердити</button>
    </form>
  );
}
