import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // додано

const S_URL = "http://localhost:8080";

export default function MyDetails() {
  const [details, setDetails] = useState([]);
  const [expandedDetailId, setExpandedDetailId] = useState(null);
  const [technologicalSituations, setTechnologicalSituations] = useState([]);
  const [mode, setMode] = useState("main");
  const [suggestedSets, setSuggestedSets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // ініціалізація
  // useEffect(() => {
  //   if (mode === "myDetails") {
  //     setIsLoading(true);
  //     const processingTypeId = technologicalSituations.
  //     const processingMethodId =
  //     let materialId = null;
  //     const materialRaw = localStorage.getItem("selectedMaterial");

  //     if (materialRaw) {
  //       try {
  //         const material = JSON.parse(materialRaw);
  //         if (material && material.id) {
  //           materialId = material.id;
  //         }
  //       } catch (e) {
  //         console.error("❌ Помилка при розборі material:", e);
  //       }
  //     }

  //     // Пример использования
  //     if (!processingTypeId || !processingMethodId || !materialId) {
  //       alert("⚠️ Не всі параметри вибрано!");
  //       // Можешь остановить выполнение, если нужно
  //       return;
  //     }

  //     fetch(
  //       `${S_URL}/api/technological-solution/set/suggested?processingTypeId=${processingTypeId}&processingMethodId=${processingMethodId}&materialId=${materialId}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     )
  //       .then((res) => {
  //         if (!res.ok) {
  //           throw new Error(`❌ Сервер повернув ${res.status}`);
  //         }
  //         return res.json();
  //       })
  //       .then((res) => {
  //         if (Array.isArray(res)) {
  //           setSuggestedSets(res.slice(0, 3));
  //         }
  //         // Якщо бекенд повертає { data: [...] }
  //         else if (res.data && Array.isArray(res.data)) {
  //           setSuggestedSets(res.data.slice(0, 3));
  //         } else {
  //           console.warn("⚠️ Невідомий формат відповіді:", res);
  //         }
  //       })
  //       .catch(() => alert("❌ Не вдалося завантажити рекомендовані комплекти"))
  //       .finally(() => setIsLoading(false));
  //   }
  // }, [mode]);
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
    fetch(`${S_URL}/api/technological-situation/getAll?detailId=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("🎯 От сервера:", data);
        setTechnologicalSituations(data.data);

        setMode("myDetails");
      })
      .catch((err) => alert("Error: " + err.message));
  };
  const renderSetPreview = (title, data) => (
    <fieldset style={{ marginBottom: "1rem", opacity: 0.9 }}>
      <legend>{title}</legend>

      <div>
        <strong>Назва:</strong> {data.name}
      </div>
      <div>
        <strong>Маркування:</strong> {data.marking}
      </div>
      <div>
        <strong>Артикул:</strong> {data.articleNumber}
      </div>
      <div>
        <strong>Посилання:</strong>{" "}
        <a href={data.link} target="_blank" rel="noopener noreferrer">
          {data.link}
        </a>
      </div>

      {title === "Інструмент" && (
        <div>
          <strong>Матеріал інструменту:</strong> {data.material}
        </div>
      )}

      <div>
        <strong>Постачальник:</strong> {data.supplier.name}
      </div>

      <div>
        <strong>Бренд:</strong> {data.brandName}
      </div>

      <div>
        <strong>Ціна:</strong> {data.websiteData.price || "—"}
      </div>
      <div>
        <strong>Наявність:</strong>{" "}
        {data.websiteData.isAvailable === true ? "В наявності" : "Немає"}
      </div>
    </fieldset>
  );
  return (
    <div>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
        ◀ Назад
      </button>

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
            {expandedDetailId === detail.id && mode === "myDetails" && (
              <table
                border="1"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "center",
                }}
              >
                <thead>
                  <tr>
                    <th rowSpan={2}>№</th>
                    <th rowSpan={3} colSpan={2}>
                      Технологічна ситуація
                    </th>
                    <th colSpan={3}>Технічне рішення</th>
                    <th colSpan={3}>Постачальник №1</th>
                    <th colSpan={3}>Постачальник №2</th>
                    <th colSpan={3}>Постачальник №3</th>
                  </tr>
                  <tr>
                    <th>Оправка</th>
                    <th>Інструмент</th>
                    <th>Адаптер</th>
                    <th>Оправка</th>
                    <th>Інструмент</th>
                    <th>Адаптер</th>
                    <th>Оправка</th>
                    <th>Інструмент</th>
                    <th>Адаптер</th>
                    <th>Оправка</th>
                    <th>Інструмент</th>
                    <th>Адаптер</th>
                  </tr>
                </thead>
                <tbody>
                  {technologicalSituations.map((situation, idx) => {
                    return suggestedSets.map((item, i) => (
                      <tr key={`${idx}-${i}`}>
                        {i === 0 && (
                          <>
                            <td rowSpan={suggestedSets.length}>{idx + 1}</td>
                            <td rowSpan={suggestedSets.length}>
                              <img
                                src={situation.processingTypeNode.url}
                                alt="Тип"
                                style={{ maxWidth: "50px" }}
                              />
                            </td>
                            <td rowSpan={suggestedSets.length}>
                              {situation.processingMethod.name}
                            </td>
                          </>
                        )}
                        {/* Державка */}
                        <td>
                          {item?.toolHolder ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              {renderSetPreview("Державка", item.toolHolder)}
                              <input
                                type="checkbox"
                                checked={
                                  selectedSetItems[i]?.toolHolder || false
                                }
                                onChange={() =>
                                  toggleSetItemSelection(i, "toolHolder")
                                }
                                style={{ accentColor: "green" }}
                              />
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>

                        {/* Інструмент */}
                        <td>
                          {item?.instrument ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              {renderSetPreview("Інструмент", item.instrument)}
                              <input
                                type="checkbox"
                                checked={
                                  selectedSetItems[i]?.instrument || false
                                }
                                onChange={() =>
                                  toggleSetItemSelection(i, "instrument")
                                }
                                style={{ accentColor: "green" }}
                              />
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>

                        {/* Адаптер */}
                        <td>
                          {item?.toolAdapter ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              {renderSetPreview("Адаптер", item.toolAdapter)}
                              <input
                                type="checkbox"
                                checked={
                                  selectedSetItems[i]?.toolAdapter || false
                                }
                                onChange={() =>
                                  toggleSetItemSelection(i, "toolAdapter")
                                }
                                style={{ accentColor: "green" }}
                              />
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ));
                  })}
                </tbody>
              </table>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
