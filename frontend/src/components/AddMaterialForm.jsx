import React, { useState } from "react";

const S_URL = "http://100.104.181.58:8080";

function AddMaterialForm({ onBack }) {
  const [form, setForm] = useState({
    brand: "",
    groupIso: "",
    hardnessMin: "",
    hardnessMax: "",
    hardness: ""
  });
  const [responseStatus, setResponseStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const min = Number(form.hardnessMin);
    const max = Number(form.hardnessMax);
    const hardness = Number(form.hardness);

    if (isNaN(min) || isNaN(max) || isNaN(hardness)) {
      setResponseStatus({ status: "error", message: "Всі значення мають бути числами" });
      return;
    }

    if (min < 0 || max < 0) {
      setResponseStatus({ status: "error", message: "Твердість не може бути менше 0" });
      return;
    }

    if (min > max) {
      setResponseStatus({ status: "error", message: "Мінімальна твердість більша за максимальну" });
      return;
    }

    const payload = {
      brand: String(form.brand),
      groupIso: String(form.groupIso),
      hardnessSpan: `${min}-${max}`,
      hardness: String(hardness)
    };

    fetch(`${S_URL}/api/material/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(payload)
    })
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        let message = "";
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          message = data.message || JSON.stringify(data);
        } else {
          message = await res.text();
        }

        if (!res.ok) throw new Error(message);
        setResponseStatus({ status: "success", message });
        setTimeout(() => {
          onBack();
        }, 1500);
      })
      .catch((err) => {
        setResponseStatus({ status: "error", message: err.message });
      });
  };

  const min = Number(form.hardnessMin);
  const max = Number(form.hardnessMax);
  const showSlider = !isNaN(min) && !isNaN(max) && min < max;

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>Додати матеріал</h3>

      <label>Назва матеріалу (бренд)</label>
      <input
        type="text"
        name="brand"
        placeholder="Наприклад: P20"
        value={form.brand}
        onChange={(e) => setForm({ ...form, brand: e.target.value })}
        required
      />

      <label>Група ISO</label>
      <input
        type="text"
        name="groupIso"
        placeholder="Наприклад: P"
        value={form.groupIso}
        onChange={(e) => setForm({ ...form, groupIso: e.target.value })}
        required
      />

      <label>Мін. твердість</label>
      <input
        type="number"
        name="hardnessMin"
        placeholder="Мінімум"
        value={form.hardnessMin}
        onChange={(e) => setForm({ ...form, hardnessMin: e.target.value })}
      />

      <label>Макс. твердість</label>
      <input
        type="number"
        name="hardnessMax"
        placeholder="Максимум"
        value={form.hardnessMax}
        onChange={(e) => setForm({ ...form, hardnessMax: e.target.value })}
      />

      {showSlider && (
        <>
          <label>Показник твердості: {form.hardness}</label>
          <input
            type="range"
            min={min}
            max={max}
            step={1} // 👈 це обов'язково
            value={Number(form.hardness)}
            onChange={(e) =>
              setForm({ ...form, hardness: Number(e.target.value) })
            }
          />
        </>
      )}

      <button type="submit">Зберегти</button>
      <button type="button" onClick={onBack}>
        Назад
      </button>

      {responseStatus && (
        <div
          className={responseStatus.status === "success" ? "success" : "error"}
        >
          {responseStatus.status === "success"
            ? "✅Успішно додано!"
            : "❌Помилка додавання!"}{" "}
          {responseStatus.message}
        </div>
      )}
    </form>
  );
}

export default AddMaterialForm;
