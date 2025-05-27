import React, { useEffect, useState } from "react";

const S_URL = "http://localhost:8080";

export default function ProcessingTreeForm({
  selectedCoolingType,
  selectedCoolingMethod,
  selectedDetail,
  details,
  setSelectedTypeId,
  selectedMethodId,
}) {
  const [nodesByLevel, setNodesByLevel] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState({});
  const [node, setLevelNode] = useState(null);
  const [levelIndex, setLevelIndex] = useState(null);

  // Отримуємо збережену деталь з localStorage
  const detail = details?.find((d) => d.id === parseInt(selectedDetail));

  const detailId = detail?.id;
  const detailName = detail?.name;

  useEffect(() => {
    if (selectedMethodId && selectedNode && levelIndex !== null) {
      handleNodeClick(selectedNode, levelIndex);
    }
  }, [selectedMethodId]);

  useEffect(() => {
    fetch(`${S_URL}/api/processing-type/children`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const array = Object.values(data.data);
        setNodesByLevel([[...array]]);
      })
      .catch((err) => alert("❌ Не вдалося завантажити дерево"));
  }, []);

  const handleNodeClick = (node, level, method = selectedMethodId) => {
    if (!selectedMethodId) {
      alert("❌ Спочатку оберіть метод обробки");
      return;
    }

    setSelectedNode(node);
    setAttributes([]);
    const newLevels = nodesByLevel.slice(0, level + 1);

    if (node.leaf) {
      setSelectedTypeId?.(node.id);
      fetch(`${S_URL}/api/processing-type/children/attributes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ nodeId: node.id, methodId: method }),
      })
        .then((res) => res.json())
        .then((res) => {
          setNodesByLevel(newLevels);
          if (res.data && res.data.attributes) {
            setAttributes(res.data.attributes);
          }
        })
        .catch((err) => alert("❌ Не вдалося завантажити атрибути"));
    } else {
      fetch(`${S_URL}/api/processing-type/children?parentId=${node.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          newLevels.push(data.data);
          setNodesByLevel(newLevels);
        })
        .catch((err) => alert("❌ Не вдалося завантажити дочірні вузли"));
    }
  };

  const handleSaveAttributeValues = () => {
    if (!detailId) {
      alert("❌ Оберіть деталь");
      return;
    }

    const missingRequired = attributes
      .filter((attr) => attr.isRequired)
      .filter((attr) => !attributeValues[attr.id]?.trim());

    if (missingRequired.length > 0) {
      const names = missingRequired.map((a) => `• ${a.name}`).join("\n");
      alert(`❌ Заповніть усі обов'язкові атрибути:\n${names}`);
      return;
    }

    const payload = {
      processingTypeId: selectedNode.id,
      detailId: detailId,
      values: Object.entries(attributeValues).map(([attributeId, value]) => ({
        attributeId: parseInt(attributeId),
        value,
      })),
    };

    // Добавим coolingTypeId, только если выбран
    if (selectedCoolingType) {
      payload.coolingTypeId = parseInt(selectedCoolingType);
    }
    if (selectedCoolingMethod) {
      payload.coolingMethodId = parseInt(selectedCoolingMethod);
    }

    fetch(`${S_URL}/api/processing-type/attribute-values/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        const saved = data.saved;
        const duplicates = data.duplicates || [];

        let message = `✅ Збережено: ${saved}`;
        if (duplicates.length > 0) {
          message += `\n⚠️ Пропущено дублікатів: ${duplicates.length}`;
        }

        alert(message);
        setAttributeValues({});
      })
      .catch(() => alert("❌ Помилка при збереженні значень"));
  };

  return (
    <div className="tree-form">
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <div
          className="tree-levels"
          style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}
        >
          {nodesByLevel.map((levelNodes, levelIdx) => (
            <div key={levelIdx}>
              {levelNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;

                return (
                  <div
                    key={node.id}
                    onClick={() => {
                      setLevelNode(node);
                      setLevelIndex(levelIdx);
                      handleNodeClick(node, levelIdx);
                    }}
                    style={{
                      padding: "8px 12px",
                      marginBottom: "4px",
                      cursor: "pointer",
                      background: isSelected ? "#def" : "#fff",
                    }}
                  >
                    <img
                      src={node.url}
                      className={isSelected ? "node-img selected" : "node-img"}
                      alt={node.url}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {selectedNode?.leaf && attributes.length > 0 && (
          <div
            style={{
              minWidth: "300px",
              padding: "1rem",
              background: "#f9f9f9",
              borderRadius: "8px",
            }}
          >
            <h4>Атрибути для: {selectedNode?.url}</h4>
            {detailName && (
              <p>
                🔧 <strong>Обрана деталь:</strong> {detailName} (ID: {detailId})
              </p>
            )}

            {attributes.map((attr) => (
              <div key={attr.id} style={{ marginBottom: "1rem" }}>
                <label>
                  {attr.name} {attr.isRequired ? "*" : "(необов'язковий)"}
                </label>
                <input
                  type="text"
                  required={attr.isRequired}
                  placeholder={attr.isRequired ? "Обов’язкове поле" : ""}
                  value={attributeValues[attr.id] || ""}
                  onChange={(e) =>
                    setAttributeValues({
                      ...attributeValues,
                      [attr.id]: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    backgroundColor: attr.isRequired ? "#fff9f9" : "#fff",
                  }}
                />
              </div>
            ))}

            <button onClick={handleSaveAttributeValues}>
              💾 Зберегти значення
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
