import React, { useState, useEffect } from "react";

const S_URL = "http://100.104.181.58:8080";

export default function MachineForm() {
  const [mode, setMode] = useState("main"); // "main" | "lathe" | "milling"
  const [showAttrForm, setShowAttrForm] = useState(false);
  const [attrType, setAttrType] = useState("String");
  const [attrName, setAttrName] = useState("");
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState({});
  const [machineData, setMachineData] = useState({
    inventoryNumber: "",
    workshopNumber: "",
    model: "",
    chpkSystem: ""
  });

  const machineType = mode === "lathe" ? "LATHE" : mode === "milling" ? "MILLING" : "";

  useEffect(() => {
    if (mode === "lathe" || mode === "milling") {
      fetch(`${S_URL}/api/machine_attribute/by-type?type=${machineType}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setAttributes(data.data || []))
        .catch(() => alert("❌ Не вдалося завантажити атрибути"));
    }
  }, [mode]);

  const handleAddOption = () => {
    if (newOption.trim() !== "") {
      setOptions((prev) => [...prev, newOption.trim()]);
      setNewOption("");
    }
  };

  const handleSaveAttribute = () => {
    const payload = {
      machineType,
      inputType: attrType,
      name: attrName,
      ...(attrType === "Select" && { options }),
    };

    fetch(`${S_URL}/api/machine_attribute/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Помилка збереження атрибута");
        alert("✅ Атрибут збережено!");
        setAttrName("");
        setAttrType("String");
        setOptions([]);
        setNewOption("");
        setShowAttrForm(false);
      })
      .catch(() => alert("❌ Не вдалося зберегти атрибут"));
  };

  const handleSaveMachine = () => {
    const attributesPayload = Object.values(attributeValues).map(({ attributeId, value }) => ({
      attributeId,
      value
    }));

    const fullMachineData = {
      ...machineData,
      type: machineType,
      attributes: attributesPayload
    };

    localStorage.setItem("selectedMachine", JSON.stringify(fullMachineData));

    fetch(`${S_URL}/api/machines/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(fullMachineData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Помилка збереження станка");
        alert("✅ Станок збережено локально і на сервері!");
        setMachineData({
          inventoryNumber: "",
          workshopNumber: "",
          model: "",
          chpkSystem: ""
        });
        setAttributeValues({});
        setMode("main");
      })
      .catch(() => alert("❌ Не вдалося зберегти станок"));
  };

  if (mode === "main") {
    return (
      <div className="form">
        <h3>Додати атрибут для станка</h3>
        <button onClick={() => setMode("lathe")}>Додати токарний станок</button>
        <button onClick={() => setMode("milling")}>Додати фрезерний станок</button>
      </div>
    );
  }

  return (
    <div className="form">
      <h3>{machineType === "LATHE" ? "Токарний станок" : "Фрезерний станок"}</h3>

      {!showAttrForm ? (
        <>
          <fieldset>
            <legend>Дані про верстат</legend>
            <label>Інвентарний номер</label>
            <input
              type="text"
              value={machineData.inventoryNumber}
              onChange={(e) => setMachineData(prev => ({ ...prev, inventoryNumber: e.target.value }))}
            />

            <label>Номер цеху</label>
            <input
              type="text"
              value={machineData.workshopNumber}
              onChange={(e) => setMachineData(prev => ({ ...prev, workshopNumber: e.target.value }))}
            />

            <label>Модель</label>
            <input
              type="text"
              value={machineData.model}
              onChange={(e) => setMachineData(prev => ({ ...prev, model: e.target.value }))}
            />

            <label>Система ЧПК</label>
            <input
              type="text"
              value={machineData.chpkSystem}
              onChange={(e) => setMachineData(prev => ({ ...prev, chpkSystem: e.target.value }))}
            />
          </fieldset>

          <fieldset>
            <legend>Технічні характеристики верстату</legend>
            {attributes.map((attr, i) => (
              <div key={i}>
                <label>{attr.name}</label>
                {attr.inputType === "Boolean" ? (
                  <select
                    value={attributeValues[attr.name]?.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAttributeValues(prev => ({
                        ...prev,
                        [attr.name]: {
                          attributeId: attr.id,
                          value
                        }
                      }));
                    }}
                  >
                    <option value="">Оберіть</option>
                    <option value="true">Так</option>
                    <option value="false">Ні</option>
                  </select>
                ) : attr.inputType === "Select" ? (
                  <select
                    value={attributeValues[attr.name]?.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAttributeValues(prev => ({
                        ...prev,
                        [attr.name]: {
                          attributeId: attr.id,
                          value
                        }
                      }));
                    }}
                  >
                    <option value="">Оберіть</option>
                    {attr.options.map((opt, j) => (
                      <option key={j} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={attributeValues[attr.name]?.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAttributeValues(prev => ({
                        ...prev,
                        [attr.name]: {
                          attributeId: attr.id,
                          value
                        }
                      }));
                    }}
                  />
                )}
              </div>
            ))}
          </fieldset>

          <button onClick={handleSaveMachine}>💾 Зберегти станок</button>
          <button onClick={() => setShowAttrForm(true)}>➕ Додати атрибут</button>
          <button onClick={() => setMode("main")}>Назад</button>
        </>
      ) : (
        <div>
          <h4>Додати атрибут</h4>

          <label>Input Type</label>
          <select value={attrType} onChange={(e) => setAttrType(e.target.value)}>
            <option value="String">String</option>
            <option value="Boolean">Boolean</option>
            <option value="Select">Select</option>
          </select>

          <label>Назва атрибута</label>
          <input
            type="text"
            value={attrName}
            onChange={(e) => setAttrName(e.target.value)}
          />

          {attrType === "Select" && (
            <div>
              <label>Значення</label>
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
              />
              <button onClick={handleAddOption}>➕ Додати значення</button>

              <ul>
                {options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={handleSaveAttribute}>Зберегти атрибут</button>
          <button onClick={() => setShowAttrForm(false)}>Назад</button>
        </div>
      )}
    </div>
  );
}