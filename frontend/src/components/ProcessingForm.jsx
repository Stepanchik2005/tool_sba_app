import React, { useState, useEffect } from "react";
import ProcessingTreeForm from "./ProcessingTreeForm";
import { processingMethods } from "./constants";
import { S_URL } from "./constants";
//const S_URL = "http://localhost:8080";
const units = ["мм", "мкм"];

export default function ProcessingForm() {
  const [mode, setMode] = useState(null);
  const [url, setUrl] = useState("");
  const [parentId, setParentId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [attributeId, setAttributeId] = useState("");
  const [allAttributes, setAllAttributes] = useState([]);
  const [unit, setUnit] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [methodName, setMethodName] = useState(null);

  const [showCreateAttribute, setShowCreateAttribute] = useState(false);
  const [newAttributeName, setNewAttributeName] = useState("");
  const [newAttributeUnit, setNewAttributeUnit] = useState("мм");
  const [selectedTypeId, setSelectedTypeId] = useState(""); // те що приходить з дерева
  // NEW: Cooling states
  const [coolingTypes, setCoolingTypes] = useState([]);
  const [coolingMethods, setCoolingMethods] = useState([]);
  const [selectedCoolingType, setSelectedCoolingType] = useState("");
  const [selectedCoolingMethod, setSelectedCoolingMethod] = useState("");

  const [details, setDetails] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState("");

  const [machines, setMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState("");

  const [userMethods, setUserMethods] = useState([]);
  const [selectedMethodId, setSelectedMethodId] = useState(null);

  //const [isTechSituationSet, setIsTechSitruationSet] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem("userDetailHistory");
    if (cached) setDetails(JSON.parse(cached));

    const cached_m = localStorage.getItem("userMachineHistory");
    if (cached_m) setMachines(JSON.parse(cached_m));

    const savedDetail = localStorage.getItem("selectedDetail");
    if (savedDetail) setSelectedDetail(savedDetail);

    const savedMethod = localStorage.getItem("selectedMethodId");
    if (savedMethod) setSelectedMethodId(savedMethod);

    const savedCoolingType = localStorage.getItem("selectedCoolingType");
    if (savedCoolingType) setSelectedCoolingType(savedCoolingType);

    const savedCoolingMethod = localStorage.getItem("selectedCoolingMethod");
    if (savedCoolingMethod) setSelectedCoolingMethod(savedCoolingMethod);

    const savedMachine = localStorage.getItem("selectedMachine");
    if (savedMachine) setSelectedMachine(savedMachine);
  }, []);

  // Load attributes
  useEffect(() => {
    if (mode === "attribute") {
      fetch(`${S_URL}/api/processing-type/attributes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.data) {
            setAllAttributes(res.data);
          }
        })
        .catch(() => alert("❌ Не вдалося завантажити атрибути"));
    }
  }, [mode]);

  // Охлаждение и методы
  useEffect(() => {
    fetch(`${S_URL}/api/cooling/types`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => setCoolingTypes(res.data || []))
      .catch(() => alert("❌ Не вдалося завантажити типи охолодження"));

    fetch(`${S_URL}/api/cooling/methods`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => setCoolingMethods(res.data || []))
      .catch(() => alert("❌ Не вдалося завантажити методи охолодження"));

    fetch(`${S_URL}/api/processing-methods`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => setUserMethods(res.data || []))
      .catch(() => alert("❌ Не вдалося завантажити методи охолодження"));
  }, []);

  // // История
  // useEffect(() => {
  //   const cached = localStorage.getItem("userDetailHistory");
  //   if (cached) {
  //     setDetails(JSON.parse(cached));
  //   }
  //   const cached_m = localStorage.getItem("userMachineHistory");
  //   if (cached_m) {
  //     setMachines(JSON.parse(cached_m));
  //   }
  //   const saved = localStorage.getItem("selectedDetail");
  //   if (saved) {
  //     setSelectedDetail(saved);
  //   }
  // }, []);

  const handleProcessingTypeSubmit = () => {
    fetch(`${S_URL}/api/processing-type/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ url, parentId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        alert("✅ Тип обробки додано!");
        setUrl("");
        setParentId("");
        setMode(null);
      })
      .catch(() => alert("❌ Помилка при додаванні типу обробки"));
  };

  const handleAttributeSubmit = () => {
    fetch(`${S_URL}/api/processing-type/attribute/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        typeId,
        attributeId: parseInt(attributeId),
        isRequired,
        methodName,
        coolingTypeId: parseInt(selectedCoolingType),
        coolingMethodId: parseInt(selectedCoolingMethod),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        alert("✅ Атрибут додано!");
        setIsRequired(false);
        setMethodName("");
      })
      .catch(() => alert("❌ Помилка при додаванні атрибуту"));
  };

  const handleCreateNewAttribute = () => {
    fetch(`${S_URL}/api/processing-type/attributes/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name: newAttributeName, unit: newAttributeUnit }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          setAllAttributes([...allAttributes, res.data]);
          setAttributeId(res.data.id);
          setShowCreateAttribute(false);
          setNewAttributeName("");
        }
      })
      .catch(() => alert("❌ Не вдалося створити атрибут"));
  };
  const handleSaveTechnologicalSituation = () => {
    const selectedMaterial = localStorage.getItem("selectedMaterial");
    if (
      !selectedDetail ||
      !selectedMachine ||
      !selectedMethodId ||
      !selectedCoolingType ||
      !selectedCoolingMethod ||
      !selectedTypeId ||
      !selectedMaterial
    ) {
      alert("❌ Будь ласка, оберіть деталь, станок, метод та інше");
      return;
    }
    let materialId = null;
    const materialRaw = localStorage.getItem("selectedMaterial");

    if (materialRaw) {
      try {
        const material = JSON.parse(materialRaw);
        if (material && material.id) {
          materialId = material.id;
        }
      } catch (e) {
        console.error("❌ Помилка при розборі material:", e);
      }
    }

    fetch(`${S_URL}/api/technological-situation/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        detailId: parseInt(selectedDetail),
        machineId: parseInt(selectedMachine),
        processingMethodId: parseInt(selectedMethodId),
        processingTypeId: parseInt(selectedTypeId),
        coolingTypeId: parseInt(selectedCoolingType),
        coolingMethodId: parseInt(selectedCoolingMethod),
        materialId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("technical-situation", true);
        localStorage.setItem("saved-technical-situation-id", data.id);
        alert("✅ Тех. рішення збережено успішно!");
      })
      .catch(() => alert("❌ Помилка при збереженні тех. рішення"));
  };
  return (
    <div className="tech-solution-window">
      <div className="toolbar" style={{ marginBottom: "1rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <button onClick={() => setMode("type")}>➕ Додати тип обробки</button>
          <button onClick={() => setMode("attribute")}>
            ➕ Додати атрибут
          </button>
          <label>Метод обробки</label>
          <select
            value={selectedMethodId}
            onChange={(e) => {
              const newMethod = e.target.value;
              setSelectedMethodId(newMethod);

              const selectedMethod = userMethods.find(
                (m) => m.id.toString() === newMethod
              );

              if (selectedMethod) {
                localStorage.setItem("selectedMethodId", selectedMethod.id);
                localStorage.setItem(
                  "selectedProcessingName",
                  selectedMethod.name
                );
              }

              handleNodeClick(node, levelIndex, newMethod);
            }}
          >
            <option value="">Оберіть метод</option>
            {userMethods.map((method, i) => (
              <option key={i} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>
          <div>
            <label style={{ display: "block" }}>Тип охолодження</label>
            <select
              value={selectedCoolingType}
              onChange={(e) => {
                setSelectedCoolingType(e.target.value);
                localStorage.setItem("selectedCoolingType", e.target.value);
              }}
            >
              <option value="">Оберіть тип</option>
              {coolingTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block" }}>Вид охолодження</label>
            <select
              value={selectedCoolingMethod}
              onChange={(e) => {
                setSelectedCoolingMethod(e.target.value);
                localStorage.setItem("selectedCoolingMethod", e.target.value);
              }}
            >
              <option value="">Оберіть вид</option>
              {coolingMethods.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: "block" }}>Деталь</label>
            <select
              value={selectedDetail}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedDetail(value);

                const selectedDetail = details.find(
                  (d) => d.id.toString() === value
                );
                if (selectedDetail) {
                  localStorage.setItem(
                    "selectedDetailName",
                    selectedDetail.name
                  );
                  localStorage.setItem("selectedDetail", selectedDetail.id);
                }
              }}
            >
              <option value="">Оберіть деталь</option>
              {details.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: "block" }}>Верстати</label>
            <select
              value={selectedMachine}
              onChange={(e) => {
                setSelectedMachine(e.target.value);
                localStorage.setItem("selectedMachine", e.target.value);
              }}
            >
              <option value="">Оберіть станок</option>
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.inventoryNumber}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {mode === "type" && (
        <div className="form-block">
          <h3>Додати тип обробки</h3>
          <label>URL</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} />
          <label>Parent ID</label>
          <input
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
          />
          <button onClick={handleProcessingTypeSubmit}>Зберегти</button>
          <button onClick={() => setMode(null)}>Назад</button>
        </div>
      )}

      {mode === "attribute" && (
        <div className="form-block">
          <h3>Додати атрибут до типу обробки</h3>
          <label>Type ID</label>
          <input value={typeId} onChange={(e) => setTypeId(e.target.value)} />

          <label>Атрибут</label>
          <select
            value={attributeId}
            onChange={(e) => setAttributeId(e.target.value)}
          >
            <option value="">Оберіть атрибут</option>
            {allAttributes.map((attr) => (
              <option key={attr.id} value={attr.id}>
                {attr.name} {attr.unit && `(${attr.unit})`}
              </option>
            ))}
          </select>

          <button type="button" onClick={() => setShowCreateAttribute(true)}>
            ➕ Створит и новий атрибут
          </button>

          {showCreateAttribute && (
            <div style={{ marginTop: "1rem" }}>
              <label>Назва нового атрибуту</label>
              <input
                value={newAttributeName}
                onChange={(e) => setNewAttributeName(e.target.value)}
              />
              <label>Одиниця</label>
              <select
                value={newAttributeUnit}
                onChange={(e) => setNewAttributeUnit(e.target.value)}
              >
                {units.map((u, i) => (
                  <option key={i} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <button type="button" onClick={handleCreateNewAttribute}>
                💾 Зберегти атрибут
              </button>
            </div>
          )}

          <label>Обов'язковий</label>
          <input
            type="checkbox"
            checked={isRequired}
            onChange={(e) => setIsRequired(e.target.checked)}
          />

          <label>Назва методу</label>
          <select
            value={methodName}
            onChange={(e) => setMethodName(e.target.value)}
          >
            <option value="">Оберіть метод</option>
            {processingMethods.map((method, i) => (
              <option key={i} value={method}>
                {method}
              </option>
            ))}
          </select>

          {/* 🔽 Вибір охолодження */}
          <label>Тип охолодження</label>
          <select
            value={selectedCoolingType}
            onChange={(e) => setSelectedCoolingType(e.target.value)}
          >
            <option value="">Оберіть тип</option>
            {coolingTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <label>Вид охолодження</label>
          <select
            value={selectedCoolingMethod}
            onChange={(e) => setSelectedCoolingMethod(e.target.value)}
          >
            <option value="">Оберіть вид</option>
            {coolingMethods.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <button onClick={handleAttributeSubmit}>Зберегти</button>
          <button onClick={() => setMode(null)}>Назад</button>
        </div>
      )}
      <button
        onClick={handleSaveTechnologicalSituation}
        style={{
          background: "#4CAF50",
          color: "white",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
        }}
      >
        💾 Зберегти тех. рішення
      </button>
      <div className="tree-view-block">
        <ProcessingTreeForm
          selectedCoolingType={selectedCoolingType}
          selectedCoolingMethod={selectedCoolingMethod}
          selectedDetail={selectedDetail}
          details={details}
          setSelectedTypeId={setSelectedTypeId}
          selectedMethodId={selectedMethodId}
        />
      </div>
    </div>
  );
}
