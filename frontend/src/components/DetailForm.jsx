import React, { useEffect, useState } from "react";

const S_URL = "http://100.104.181.58:8080";

export default function DetailForm() {
  const [formData, setFormData] = useState({
    orderNumber: "",
    detailNumber: "",
    detailName: "",
    shape: "",
    type: "",
  });

  const [shapes, setShapes] = useState([]);
  const [types, setTypes] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState({});

  const [mode, setMode] = useState("main");

  // Стан для форми "Тип - Форма"
  const [typeInput, setTypeInput] = useState("");
  const [shapeInputForType, setShapeInputForType] = useState("");

  // Стан для форми "Атрибут - Форма"
  const [attrName, setAttrName] = useState("");
  const [attrUnit, setAttrUnit] = useState("");
  const [attrShape, setAttrShape] = useState("");

    const fetchShapes = () => {
    fetch(`${S_URL}/api/details/shapes`, {
        headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    })
        .then((res) => res.json())
        .then((data) => setShapes(data.data || []))
        .catch((err) => console.error("Помилка завантаження форм:", err));
    };


  const fetchTypes = () => {
  if (!formData.shape) return; // Без форми — не вантажимо типи

  fetch(`${S_URL}/api/details/types?shape=${encodeURIComponent(formData.shape)}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => setTypes(data.data || []))
    .catch((err) => console.error("Помилка завантаження типів:", err));
};


  useEffect(() => {
  if (formData.shape) {
    fetch(`${S_URL}/api/detail_attributes?shape=${encodeURIComponent(formData.shape)}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setAttributes(data.data || []))
      .catch((err) => console.error("Помилка завантаження атрибутів:", err));
  }
}, [formData.shape]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttributeChange = (e, attr) => {
  const value = e.target.value;
  setAttributeValues((prev) => ({
    ...prev,
    [attr.name]: {
      attributeId: attr.id,
      value: value
    }
  }));
};


    const handleSubmit = () => {
  const requiredFields = [
    formData.orderNumber,
    formData.detailNumber,
    formData.detailName,
    formData.shape,
    formData.type,
  ];

  const areMainFieldsFilled = requiredFields.every((val) => val && val.trim() !== "");

  const areAttributesFilled = attributes.every(attr => {
  const field = attributeValues[attr.name];
  return field && field.value && field.value.trim() !== "";
});


  if (!areMainFieldsFilled || !areAttributesFilled) {
    alert("❌ Будь ласка, заповніть всі поля перед збереженням.");
    return;
  }

  const detailPayload = {
  number: formData.detailNumber,
  name: formData.detailName,
  orderNumber: formData.orderNumber,
  shape: formData.shape,
  type: formData.type,
  attributes: Object.values(attributeValues).map(({ attributeId, value }) => ({
    attributeId,
    value
  })),
};



  // 💾 Збереження в localStorage
  localStorage.setItem("selectedDetail", JSON.stringify(detailPayload));

  console.log("🧾 detailPayload:", detailPayload);

  // 📤 Відправка на бекенд
  fetch(`${S_URL}/api/details/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(detailPayload),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Помилка збереження деталі");
      alert("✅ Деталь збережено локально і на сервері!");

      // 🧼 Очищення форми після збереження
      setFormData({
        orderNumber: "",
        detailNumber: "",
        detailName: "",
        shape: "",
        type: "",
      });
      setAttributeValues({});
      setAttributes([]);
      setTypes([]);
    })
    .catch(() => alert("❌ Не вдалося зберегти деталь"));
};



  const handleTypeShapeSubmit = () => {
    fetch(`${S_URL}/api/details/shapes/add-types`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        type: typeInput,
        shape: shapeInputForType,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Помилка збереження");
        alert("✅ Тип - Форма збережено!");
        setTypeInput("");
        setShapeInputForType("");
        setMode("main");
      })
      .catch(() => alert("❌ Помилка при збереженні"));
  };

  const handleAttrShapeSubmit = () => {
    fetch(`${S_URL}/api/detail_attributes/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: attrName,
        unit: attrUnit,
        shape: attrShape,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Помилка збереження атрибута");
        alert("✅ Атрибут - Форма збережено!");
        setAttrName("");
        setAttrUnit("");
        setAttrShape("");
        setMode("main");
      })
      .catch(() => alert("❌ Помилка при збереженні атрибута"));
  };

  if (mode === "typeShape") {
    return (
      <div className="form">
        <h3>Тип - Форма</h3>
        <label>Тип</label>
        <input value={typeInput} onChange={(e) => setTypeInput(e.target.value)} />
        <label>Форма</label>
        <input value={shapeInputForType} onChange={(e) => setShapeInputForType(e.target.value)} />
        <button onClick={handleTypeShapeSubmit}>Зберегти</button>
        <button onClick={() => setMode("main")}>Назад</button>
      </div>
    );
  }

  if (mode === "attrShape") {
    return (
      <div className="form">
        <h3>Атрибут - Форма</h3>
        <label>Назва атрибута</label>
        <input value={attrName} onChange={(e) => setAttrName(e.target.value)} />
        <label>Одиниця виміру</label>
        <input value={attrUnit} onChange={(e) => setAttrUnit(e.target.value)} />
        <label>Форма</label>
        <input value={attrShape} onChange={(e) => setAttrShape(e.target.value)} />
        <button onClick={handleAttrShapeSubmit}>Зберегти</button>
        <button onClick={() => setMode("main")}>Назад</button>
      </div>
    );
  }

  return (
    <div className="form">
      <h3>Обрати деталь</h3>

      <label>Номер замовлення</label>
      <input
        type="text"
        name="orderNumber"
        value={formData.orderNumber}
        onChange={handleInputChange}
      />

      <label>Номер деталі</label>
      <input
        type="text"
        name="detailNumber"
        value={formData.detailNumber}
        onChange={handleInputChange}
      />

      <label>Назва деталі</label>
      <input
        type="text"
        name="detailName"
        value={formData.detailName}
        onChange={handleInputChange}
      />

      <label>Форма деталі</label>
      <select
        name="shape"
        value={formData.shape}
        onChange={handleInputChange}
        onClick={fetchShapes} // 🟢 оновлення при кожному відкритті
        >
        <option value="">Оберіть форму</option>
        {shapes.map((shape, i) => (
            <option key={i} value={shape}>{shape}</option>
        ))}
        </select>


      <label>Тип деталі</label>
<select
  name="type"
  value={formData.type}
  onChange={handleInputChange}
  onClick={fetchTypes} // 👈 завантаження типів при відкритті
  disabled={!formData.shape}
>
  <option value="">Оберіть тип</option>
  {types.map((type, i) => (
    <option key={i} value={type}>{type}</option>
  ))}
</select>


      {attributes.length > 0 && (
        <div>
          <h4>Атрибути</h4>
          {attributes.map((attr, i) => (
  <div key={i}>
    <label>{attr.name} ({attr.unit})</label>
    <input
      type="text"
      value={attributeValues[attr.name]?.value || ""}
      onChange={(e) => handleAttributeChange(e, attr)}
    />
  </div>
))}

        </div>
      )}

      <button onClick={handleSubmit}>💾 Зберегти деталь</button>

      <hr />
      <button onClick={() => setMode("typeShape")}>Тип - Форма</button>
      <button onClick={() => setMode("attrShape")}>Атрибут - Форма</button>
    </div>
  );
}
