import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // додано
import { S_URL } from "./constants";
//const S_URL = "http://localhost:8080";

export default function MyDetails() {
  const USER_SET_INDEX = -1;
  const [details, setDetails] = useState([]);
  const [expandedDetailId, setExpandedDetailId] = useState(null);
  const [technologicalSituations, setTechnologicalSituations] = useState([]);
  const [mode, setMode] = useState("myDetails");
  const [suggestedSets, setSuggestedSets] = useState([]);
  const [userSets, setUserSets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSetItems, setSelectedSetItems] = useState({});
  const [userSetHistory, setUserSetHistory] = useState([]);
  const [groupedStatements, setGroupedStatements] = useState({});
  const navigate = useNavigate(); // ініціалізація
  useEffect(() => {
    if (mode !== "myDetails" || technologicalSituations.length === 0) return;

    const requests = technologicalSituations.map((situation) => {
      const processingTypeId = situation.processingTypeNode?.id;
      const processingMethodId = situation.processingMethod?.id;
      const materialId = situation.material?.id;

      if (!processingTypeId || !processingMethodId || !materialId) {
        console.warn("Пропущено ситуацію без повних ID:", situation.id);
        return Promise.resolve({ situationId: situation.id, sets: [] });
      }

      return fetch(
        `${S_URL}/api/technological-solution/set/suggested?processingTypeId=${processingTypeId}&processingMethodId=${processingMethodId}&materialId=${materialId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          const sets = Array.isArray(res)
            ? res
            : Array.isArray(res.data)
            ? res.data
            : [];
          return { situationId: situation.id, sets: sets.slice(0, 3) };
        });
    });

    Promise.all(requests)
      .then((results) => {
        const mapped = {};
        results.forEach((r) => {
          if (r?.situationId) {
            mapped[r.situationId] = r.sets;
          }
        });
        setSuggestedSets(mapped);
      })
      .finally(() => setIsLoading(false));
  }, [mode, technologicalSituations]);
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
  const hasAnySelected = Object.values(selectedSetItems).some((situation) =>
    Object.values(situation).some((set) =>
      Object.values(set).some((v) => v === true)
    )
  );

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
        const mapped = {};
        data.data.forEach((t) => {
          if (t?.id) {
            mapped[t.id] = t.set;
          }
        });
        setUserSets(mapped);
        setMode("myDetails");
      })
      .catch((err) => alert("Error: " + err.message));
  };
  const handleCreateStatements = () => {
    const selectedItems = [];

    Object.entries(selectedSetItems).forEach(([situationIdStr, sets]) => {
      const situationId = parseInt(situationIdStr, 10);

      Object.entries(sets).forEach(([setIndexStr, selectedSetItem]) => {
        const setIndex = parseInt(setIndexStr, 10);

        const set =
          userSets[situationId] && setIndex === USER_SET_INDEX
            ? userSets[situationId]
            : suggestedSets[situationId]?.[setIndex] || {};

        if (selectedSetItem.toolHolder && set.toolHolder)
          selectedItems.push(set.toolHolder);
        if (selectedSetItem.instrument && set.instrument)
          selectedItems.push(set.instrument);
        if (selectedSetItem.toolAdapter && set.toolAdapter)
          selectedItems.push(set.toolAdapter);
      });
    });

    const groupedBySupplier = {};
    selectedItems.forEach((item) => {
      const supplierId = item.supplier.id;
      if (!groupedBySupplier[supplierId]) {
        groupedBySupplier[supplierId] = [];
      }
      groupedBySupplier[supplierId].push(item);
    });

    setGroupedStatements(groupedBySupplier);
    localStorage.setItem(
      "setStatementsData",
      JSON.stringify(groupedBySupplier)
    );
    //setMode("statements"); // перейти в режим перегляду відомостей
  };
  const toggleSetItemSelection = (situationId, setIndex, itemType) => {
    setSelectedSetItems((prev) => {
      const situation = prev[situationId] || {};
      const set = situation[setIndex] || {};

      return {
        ...prev,
        [situationId]: {
          ...situation,
          [setIndex]: {
            ...set,
            [itemType]: !set[itemType],
          },
        },
      };
    });
  };

  const renderSetPreview = (title, data) => (
    <fieldset style={{ margin: 0, padding: "4px", fontSize: "13px" }}>
      <div>
        <strong>Назва:</strong> {data.name}
      </div>
      <div>
        <strong>Маркування:</strong> {data.marking}
      </div>
      <div>
        <strong>Артикул:</strong> {data.articleNumber}
      </div>
      {/* <div>
        <strong>Посилання:</strong>{" "}
        <a href={data.link} target="_blank" rel="noopener noreferrer">
          {data.link}
        </a>
      </div>

      {title === "Інструмент" && (
        <div>
          <strong>Матеріал інструменту:</strong> {data.material}
        </div>
      )} */}

      {/* <div>
        <strong>Постачальник:</strong> {data.supplier.name}
      </div>

      <div>
        <strong>Бренд:</strong> {data.brandName}
      </div> */}

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
            {expandedDetailId === detail.id &&
              mode === "myDetails" &&
              (isLoading ? (
                <div style={{ marginTop: "1rem", fontStyle: "italic" }}>
                  ⏳ Завантаження рекомендованих комплектів...
                </div>
              ) : (
                <>
                  <table
                    border="1"
                    style={{
                      tableLayout: "fixed",
                      width: "100%",
                      borderCollapse: "collapse",
                      textAlign: "center",
                      overflow: "scroll",
                      tableLayout: "fixed",
                    }}
                  >
                    <colgroup>
                      <col style={{ width: "40px" }} /> {/* № */}
                      <col style={{ width: "60px" }} />{" "}
                      {/* Тип обробки (картинка) */}
                      <col style={{ width: "80px" }} /> {/* Метод обробки */}
                      <col style={{ width: "150px" }} /> {/* Атрибути */}
                      <col style={{ width: "150px" }} />{" "}
                      {/* Технічне рішення — Державка */}
                      <col style={{ width: "150px" }} />{" "}
                      {/* Технічне рішення — Інструмент */}
                      <col style={{ width: "150px" }} />{" "}
                      {/* Технічне рішення — Адаптер */}
                      <col style={{ width: "150px" }} />{" "}
                      {/* Постачальник №1 — Державка */}
                      <col style={{ width: "150px" }} />{" "}
                      {/* Постачальник №1 — Інструмент */}
                      <col style={{ width: "120px" }} />{" "}
                      {/* Постачальник №1 — Адаптер */}
                      <col style={{ width: "150px" }} />{" "}
                      {/* Постачальник №2 — Державка */}
                      <col style={{ width: "150px" }} />{" "}
                      {/* Постачальник №2 — Інструмент */}
                      <col style={{ width: "120px" }} />{" "}
                      {/* Постачальник №2 — Адаптер */}
                      <col style={{ width: "150px" }} />{" "}
                      {/* Постачальник №3 — Державка */}
                      <col style={{ width: "150px" }} />{" "}
                      {/* Постачальник №3 — Інструмент */}
                      <col style={{ width: "120px" }} />{" "}
                      {/* Постачальник №3 — Адаптер */}
                    </colgroup>
                    <thead>
                      <tr>
                        <th className="sets" rowSpan={2}>
                          №
                        </th>
                        <th className="sets" rowSpan={2} colSpan={3}>
                          Технологічна ситуація
                        </th>
                        <th className="sets" colSpan={3}>
                          Технічне рішення
                        </th>
                        <th className="sets" colSpan={3}>
                          Постачальник №1
                        </th>
                        <th className="sets" colSpan={3}>
                          Постачальник №2
                        </th>
                        <th className="sets" colSpan={3}>
                          Постачальник №3
                        </th>
                      </tr>
                      <tr>
                        <th className="sets">Оправка</th>
                        <th className="sets">Інструмент</th>
                        <th className="sets">Адаптер</th>
                        <th className="sets">Оправка</th>
                        <th className="sets">Інструмент</th>
                        <th className="sets">Адаптер</th>
                        <th className="sets">Оправка</th>
                        <th className="sets">Інструмент</th>
                        <th className="sets">Адаптер</th>
                        <th className="sets">Оправка</th>
                        <th className="sets">Інструмент</th>
                        <th className="sets">Адаптер</th>
                      </tr>
                    </thead>
                    <tbody>
                      {technologicalSituations.map((situation, idx) => {
                        const sets = suggestedSets[situation.id] || [];
                        const ourSet = userSets[situation.id] || [];

                        return (
                          <tr key={situation.id} className="sets">
                            {/* № */}
                            <td>{idx + 1}</td>

                            {/* Тип обробки */}
                            <td
                              className="sets"
                              style={{
                                paddingLeft: "0",
                                paddingRight: "0",
                              }}
                            >
                              <img
                                src={situation.processingTypeNode.url}
                                alt="Тип"
                                style={{ maxWidth: "50px" }}
                              />
                            </td>

                            {/* Метод обробки */}
                            <td className="sets">
                              {situation.processingMethod.name}
                            </td>

                            {/* Атрибути */}
                            <td
                              className="sets"
                              style={{
                                background: "#f7f7f7",
                                textAlign: "left",
                              }}
                            >
                              <strong>Атрибути:</strong>{" "}
                              {situation.attributes?.length ? (
                                situation.attributes.map((attr, j) => (
                                  <div style={{ marginBottom: "2px" }}>
                                    {attr.name}: <strong>{attr.value}</strong>{" "}
                                    {attr.unit}
                                  </div>
                                ))
                              ) : (
                                <em>Немає атрибутів</em>
                              )}
                            </td>

                            {/* Теперь справа идет 1 комплект: который делал сам юзер */}

                            {/* Державка */}
                            <td className="sets">
                              {ourSet?.toolHolder ? (
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                  {renderSetPreview(
                                    "Державка",
                                    ourSet.toolHolder
                                  )}
                                  <input
                                    type="checkbox"
                                    checked={
                                      selectedSetItems[situation.id]?.[
                                        USER_SET_INDEX
                                      ]?.toolHolder
                                    }
                                    onChange={() =>
                                      toggleSetItemSelection(
                                        situation.id,
                                        USER_SET_INDEX,
                                        "toolHolder"
                                      )
                                    }
                                    style={{ accentColor: "green" }}
                                  />
                                </div>
                              ) : (
                                "-"
                              )}
                            </td>

                            {/* Інструмент */}
                            <td className="sets">
                              {ourSet?.instrument ? (
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                  {renderSetPreview(
                                    "Інструмент",
                                    ourSet.instrument
                                  )}
                                  <input
                                    type="checkbox"
                                    checked={
                                      selectedSetItems[situation.id]?.[
                                        USER_SET_INDEX
                                      ]?.instrument || false
                                    }
                                    onChange={() =>
                                      toggleSetItemSelection(
                                        situation.id,
                                        USER_SET_INDEX,
                                        "instrument"
                                      )
                                    }
                                    style={{ accentColor: "green" }}
                                  />
                                </div>
                              ) : (
                                "-"
                              )}
                            </td>

                            {/* Адаптер */}
                            <td className="sets">
                              {ourSet?.toolAdapter ? (
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                  {renderSetPreview(
                                    "Адаптер",
                                    ourSet.toolAdapter
                                  )}
                                  <input
                                    type="checkbox"
                                    checked={
                                      selectedSetItems[situation.id]?.[
                                        USER_SET_INDEX
                                      ]?.toolAdapter || false
                                    }
                                    onChange={() =>
                                      toggleSetItemSelection(
                                        situation.id,
                                        USER_SET_INDEX,
                                        "toolAdapter"
                                      )
                                    }
                                    style={{ accentColor: "green" }}
                                  />
                                </div>
                              ) : (
                                "-"
                              )}
                            </td>

                            {/* Теперь справа идут 3 комплекти: по 3 елемента каждый */}
                            {sets.slice(0, 3).map((item, i) => (
                              <>
                                {/* Державка */}
                                <td key={`holder-${i}`} className="sets">
                                  {item?.toolHolder ? (
                                    <div
                                      style={{ display: "flex", gap: "0.5rem" }}
                                    >
                                      {renderSetPreview(
                                        "Державка",
                                        item.toolHolder
                                      )}
                                      <input
                                        type="checkbox"
                                        checked={
                                          selectedSetItems[situation.id]?.[i]
                                            ?.toolHolder || false
                                        }
                                        onChange={() =>
                                          toggleSetItemSelection(
                                            situation.id,
                                            i,
                                            "toolHolder"
                                          )
                                        }
                                        style={{ accentColor: "green" }}
                                      />
                                    </div>
                                  ) : (
                                    "-"
                                  )}
                                </td>

                                {/* Інструмент */}
                                <td key={`instr-${i}`} className="sets">
                                  {item?.instrument ? (
                                    <div
                                      style={{ display: "flex", gap: "0.5rem" }}
                                    >
                                      {renderSetPreview(
                                        "Інструмент",
                                        item.instrument
                                      )}
                                      <input
                                        type="checkbox"
                                        checked={
                                          selectedSetItems[situation.id]?.[i]
                                            ?.instrument || false
                                        }
                                        onChange={() =>
                                          toggleSetItemSelection(
                                            situation.id,
                                            i,
                                            "instrument"
                                          )
                                        }
                                        style={{ accentColor: "green" }}
                                      />
                                    </div>
                                  ) : (
                                    "-"
                                  )}
                                </td>

                                {/* Адаптер */}
                                <td key={`adapter-${i}`} className="sets">
                                  {item?.toolAdapter ? (
                                    <div
                                      style={{ display: "flex", gap: "0.5rem" }}
                                    >
                                      {renderSetPreview(
                                        "Адаптер",
                                        item.toolAdapter
                                      )}
                                      <input
                                        type="checkbox"
                                        checked={
                                          selectedSetItems[situation.id]?.[i]
                                            ?.toolAdapter || false
                                        }
                                        onChange={() =>
                                          toggleSetItemSelection(
                                            situation.id,
                                            i,
                                            "toolAdapter"
                                          )
                                        }
                                        style={{ accentColor: "green" }}
                                      />
                                    </div>
                                  ) : (
                                    "-"
                                  )}
                                </td>
                              </>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {/* 📄 Кнопка для створення відомостей */}
                  <button
                    onClick={handleCreateStatements}
                    disabled={!hasAnySelected}
                    style={{
                      marginTop: "1rem",
                      padding: "0.5rem 1rem",
                      backgroundColor: "#007bff",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: hasAnySelected ? "pointer" : "not-allowed",
                      opacity: hasAnySelected ? 1 : 0.5,
                    }}
                  >
                    📄 Сформувати відомості
                  </button>
                </>
              ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
