import React, { useEffect, useState } from "react";
import AddMaterialForm from "./AddMaterialForm";

//const S_URL = "http://100.104.181.58:8080"; // 🔧 відносний шлях
const S_URL = "http://localhost:8080";
function MaterialForm() {
  const [materials, setMaterials] = useState([]);
  const [selected, setSelected] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // ➕ поле пошуку
  const [form, setForm] = useState({
    groupIso: "",
    hardnessMin: "",
    hardnessMax: "",
    hardness: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchMaterials = () => {
    fetch(`${S_URL}/api/material/brands`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("✅ Отримано бренди:", data.data);
        setMaterials(data.data);
      })
      .catch((err) => console.error("Помилка завантаження брендів:", err));
  };

  useEffect(() => {
    if (selected) {
      fetch(
        `${S_URL}/api/material/by-brand?name=${encodeURIComponent(selected)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          const material = data.data;
          const fixed = {
            brand: material.brand,
            groupIso: material.groupIso,
            hardness: Number(material.hardness),
            hardnessMin: Number(material.hardnessSpan?.split("-")[0]),
            hardnessMax: Number(material.hardnessSpan?.split("-")[1]),
          };
          setForm(fixed);
        })
        .catch((err) => console.error("Помилка завантаження матеріалу:", err));
    }
  }, [selected]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "hardness" ? Number(value) : value,
    }));
  };

  const handleSave = () => {
    const saved = { ...form, brand: selected };
    localStorage.setItem("selectedMaterial", JSON.stringify(saved));
    console.log("💾 Збережено матеріал:", saved);
    alert("✅ Матеріал збережено локально!");
  };

  // ➕ Пошук по введеному тексту
  const filteredMaterials = materials.filter((brand) =>
    brand.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return showAddForm ? (
    <AddMaterialForm onBack={() => setShowAddForm(false)} />
  ) : (
    <div className="form">
      <h3>Матеріал</h3>

      {/* ➕ поле пошуку */}
      <label>Пошук за назвою</label>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Введіть назву (наприклад, Сталь)"
      />
      {searchTerm && (
        <div
          style={{
            border: "1px solid #ccc",
            maxHeight: "100px",
            overflowY: "auto",
          }}
        >
          {filteredMaterials.map((brand, i) => (
            <div
              key={i}
              style={{ padding: "5px", cursor: "pointer" }}
              onClick={() => {
                setSelected(brand);
                setSearchTerm("");
              }}
            >
              {brand}
            </div>
          ))}
        </div>
      )}

      <label>Оберіть матеріал</label>
      <select
        value={selected}
        onClick={fetchMaterials}
        onChange={(e) => setSelected(e.target.value)}
        style={{ maxHeight: "150px", overflowY: "auto" }} // ➕ обмеження висоти
      >
        <option value="">Оберіть матеріал</option>
        {materials.map((brand, i) => (
          <option key={i} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      <label>Група ISO</label>
      <input
        type="text"
        name="groupIso"
        value={form.groupIso}
        onChange={handleChange}
      />

      <label>Мін. твердість</label>
      <input
        type="number"
        name="hardnessMin"
        value={form.hardnessMin}
        onChange={handleChange}
      />

      <label>Макс. твердість</label>
      <input
        type="number"
        name="hardnessMax"
        value={form.hardnessMax}
        onChange={handleChange}
      />

      <label>Показник твердості: {form.hardness}</label>
      <input
        type="range"
        name="hardness"
        min={form.hardnessMin || 0}
        max={form.hardnessMax || 100}
        step={1}
        value={form.hardness}
        onChange={handleChange}
      />

      <button onClick={handleSave}>💾 Зберегти вибраний матеріал</button>
      <button onClick={() => setShowAddForm(true)}>
        ➕ Додати новий матеріал
      </button>
    </div>
  );
}

export default MaterialForm;
