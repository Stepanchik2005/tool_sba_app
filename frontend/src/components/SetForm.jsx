import React, { useEffect, useState } from "react";
import { S_URL } from "./constants";
import StarRating from "./StarRating";
import StatementBuilder from "./StatementBuilder";

function SetForm() {
  const [toolHolder, setToolHolder] = useState({
    name: "",
    marking: "",
    articleNumber: "",
    link: "",
    supplierId: "",
    brandId: "",
  });
  const [instrument, setInstrument] = useState({
    name: "",
    marking: "",
    articleNumber: "",
    link: "",
    supplierId: "",
    brandId: "",
    material: "", // 👈 нове поле
  });
  const [adapter, setAdapter] = useState({
    name: "",
    marking: "",
    articleNumber: "",
    link: "",
    supplierId: "",
    brandId: "",
  });
  const [supplier, setSupplier] = useState({
    name: "",
    edrpou: "",
    address: "",
    email: "",
    mobile: "",
  });
  const [mode, setMode] = useState(""); // "view" або "statements"
  const [groupedStatements, setGroupedStatements] = useState({});

  const [brand, setBrand] = useState({ name: "" });
  const [allSuppliers, setAllSuppliers] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [setHistory, setSetHistory] = useState(() => {
    const saved = localStorage.getItem("setHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const [suggestedSets, setSuggestedSets] = useState([]);
  const [selectedSetIds, setSelectedSetIds] = useState([]);
  const [showRating, setShowRating] = useState(false);
  const [ratings, setRatings] = useState({}); // id -> number

  const [disableDrafts, setDisableDrafts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSetItems, setSelectedSetItems] = useState({});

  const isAdmin = true; // TODO: замінити на реальну перевірку ролі
  const hasAnySelected = Object.values(selectedSetItems).some((group) => {
    return Object.values(group).some((v) => v === true);
  });

  useEffect(() => {
    localStorage.setItem("setHistory", JSON.stringify(setHistory));
  }, [setHistory]);

  useEffect(() => {
    const savedToolHolder = localStorage.getItem("toolHolderDraft");
    const savedInstrument = localStorage.getItem("instrumentDraft");
    const savedAdapter = localStorage.getItem("adapterDraft");

    if (savedToolHolder) setToolHolder(JSON.parse(savedToolHolder));
    if (savedInstrument) setInstrument(JSON.parse(savedInstrument));
    if (savedAdapter) setAdapter(JSON.parse(savedAdapter));
  }, []);

  useEffect(() => {
    if (mode === "view") {
      setIsLoading(true);
      const processingTypeId = localStorage.getItem("selectedTypeId");
      const processingMethodId = localStorage.getItem("selectedMethodId");

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

      // Пример использования
      if (!processingTypeId || !processingMethodId || !materialId) {
        alert("⚠️ Не всі параметри вибрано!");
        // Можешь остановить выполнение, если нужно
        return;
      }

      fetch(
        `${S_URL}/api/technological-solution/set/suggested?processingTypeId=${processingTypeId}&processingMethodId=${processingMethodId}&materialId=${materialId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error(`❌ Сервер повернув ${res.status}`);
          }
          return res.json();
        })
        .then((res) => {
          if (Array.isArray(res)) {
            setSuggestedSets(res.slice(0, 3));
          }
          // Якщо бекенд повертає { data: [...] }
          else if (res.data && Array.isArray(res.data)) {
            setSuggestedSets(res.data.slice(0, 3));
          } else {
            console.warn("⚠️ Невідомий формат відповіді:", res);
          }
        })
        .catch(() => alert("❌ Не вдалося завантажити рекомендовані комплекти"))
        .finally(() => setIsLoading(false));
    }
  }, [mode]);

  // Завантаження поставщиков и брендов
  useEffect(() => {
    fetch(`${S_URL}/api/supplier/get-all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          setAllSuppliers(res.data);
        } else {
          alert("⚠️ Поставщики не знайдені");
        }
      })
      .catch(() => alert("❌ Не вдалося завантажити постачальників"));

    fetch(`${S_URL}/api/brand/get-all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          setAllBrands(res.data);
        } else {
          alert("⚠️ Поставщики не знайдені");
        }
      })
      .catch(() => alert("❌ Не вдалося завантажити бренди"));
  }, []);
  const handleCreateStatements = () => {
    const selectedItems = [];

    Object.entries(selectedSetItems).forEach(([indexStr, selected]) => {
      const index = parseInt(indexStr, 10);
      const set = suggestedSets[index];

      if (selected.toolHolder) selectedItems.push(set.toolHolder);
      if (selected.instrument) selectedItems.push(set.instrument);
      if (selected.toolAdapter) selectedItems.push(set.toolAdapter);
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
  const handleChange = (e, setter, fieldName) => {
    const { name, value } = e.target;
    setter((prev) => {
      const updated = { ...prev, [name]: value };
      if (!disableDrafts) {
        const storageKey = `${fieldName}Draft`;
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
      return updated;
    });
  };
  // const handleRateChange = (setId, value) => {
  //   setRatings((prev) => ({ ...prev, [setId]: value }));
  // };
  const toggleSelection = (id) => {
    setSelectedSetIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const validate = (obj, fields) => {
    return fields.every((key) => obj[key]?.trim());
  };

  const createEntity = async (url, data) => {
    const res = await fetch(S_URL + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    const contentType = res.headers.get("content-type");
    const text = await res.text();
    console.log("👉 Ответ сервера:", text);

    if (!res.ok) {
      throw new Error("❌ HTTP Error: " + res.status);
    }

    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("❌ Сервер не вернул JSON: " + text);
    }

    return JSON.parse(text);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "name",
      "marking",
      "articleNumber",
      "link",
      "supplierId",
      "brandId",
    ];
    if (
      !validate(toolHolder, requiredFields) ||
      !validate(instrument, [...requiredFields, "material"]) // 👈 тут
    ) {
      alert("❌ Усі поля обов'язкові!");
      return;
    }

    const materialId = JSON.parse(localStorage.getItem("selectedMaterial"))?.id;
    if (!materialId) {
      alert("❌ Не обрано матеріал або відсутній його ID.");
      return;
    }

    instrument.materialId = materialId;

    try {
      const thRes = await createEntity("/api/tool-holder/create", toolHolder);
      const iRes = await createEntity("/api/instrument/create", instrument);
      var taRes = null;
      if (validate(adapter, requiredFields)) {
        taRes = await createEntity("/api/tool-adapter/create", adapter);
      }

      const situationId = JSON.parse(
        localStorage.getItem("saved-technical-situation-id")
      );

      const setPayload = {
        toolHolderId: thRes.data.id,
        instrumentId: iRes.data.id,
        toolAdapterId: taRes ? taRes.data.id : null,
        situationId,
      };

      const setRes = await createEntity("/api/set/create", setPayload);
      if (setRes?.data?.id) {
        alert("✅ Комплект успішно створено!");
        // додатково: можна зберегти його в історію або перенаправити
      } else {
        alert("⚠️ Не вдалося створити комплект");
      }
      setSetHistory((prev) => [
        ...prev,
        {
          id: setRes.data.id,
          date: new Date().toLocaleString(),
          detail: localStorage.getItem("selectedDetailName"),
          image: localStorage.getItem("selectedNodeUrl"),
          processingName: localStorage.getItem("selectedProcessingName"),
          toolHolder: toolHolder.name,
          instrument: instrument.name,
          adapter: adapter.name,
        },
      ]);
      localStorage.setItem("setHistory", setHistory);

      setDisableDrafts(true);
      localStorage.removeItem("toolHolderDraft");
      localStorage.removeItem("instrumentDraft");
      localStorage.removeItem("adapterDraft");
      // ✅ Створити технологічне рішення
      const tsPayload = {
        detailId: localStorage.getItem("selectedDetail"),
        machineId: localStorage.getItem("selectedMachine"),
        processingMethodId: localStorage.getItem("selectedMethodId"),
        processingTypeId: localStorage.getItem("selectedTypeId"),
        setId: setRes.data.id,
      };

      await createEntity("/api/technological-solution/create", tsPayload);

      alert("✅ Комплект та рішення успішно створено!");

      setToolHolder({
        name: "",
        marking: "",
        articleNumber: "",
        link: "",
        supplierId: "",
        brandId: "",
      });
      setInstrument({
        name: "",
        marking: "",
        articleNumber: "",
        link: "",
        supplierId: "",
        brandId: "",
      });
      setAdapter({
        name: "",
        marking: "",
        articleNumber: "",
        link: "",
        supplierId: "",
        brandId: "",
      });
    } catch (err) {
      console.error(err);
      alert("❌ " + err.message);
    }
  };

  const handleAddSupplier = async () => {
    if (!validate(supplier, ["name", "edrpou", "address", "email", "mobile"])) {
      alert("❌ Всі поля постачальника обов’язкові!");
      return;
    }

    try {
      await createEntity("/api/supplier/create", supplier);
      alert("✅ Постачальник доданий");
      setSupplier({
        name: "",
        edrpou: "",
        address: "",
        phone: "",
        email: "",
        mobile: "",
      });
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const handleAddBrand = async () => {
    if (!brand.name.trim()) {
      alert("❌ Назва бренда обов’язкова!");
      return;
    }
    try {
      await createEntity("/api/brand/create", brand);
      alert("✅ Бренд доданий");
      setBrand({ name: "" });
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const renderGroup = (title, data, setter, fieldName) => (
    <fieldset style={{ marginBottom: "1rem" }}>
      <legend>{title}</legend>
      <label>
        Назва:{" "}
        <input
          name="name"
          value={data.name}
          onChange={(e) => handleChange(e, setter, fieldName)}
        />
      </label>
      <br />
      <label>
        Маркування:{" "}
        <input
          name="marking"
          value={data.marking}
          onChange={(e) => handleChange(e, setter, fieldName)}
        />
      </label>
      <br />
      <label>
        Артикул:{" "}
        <input
          name="articleNumber"
          value={data.articleNumber}
          onChange={(e) => handleChange(e, setter, fieldName)}
        />
      </label>
      <br />
      <label>
        Посилання:{" "}
        <input
          name="link"
          value={data.link}
          onChange={(e) => handleChange(e, setter, fieldName)}
        />
      </label>
      <br />
      {title === "🛠️ Інструмент" && (
        <>
          <label>
            Матеріал інструменту:{" "}
            <input
              name="material"
              value={data.material}
              onChange={(e) => handleChange(e, setter, fieldName)}
            />
          </label>
          <br />
        </>
      )}
      <label>
        Supplier:{" "}
        <select
          name="supplierId"
          value={data.supplierId}
          onChange={(e) => handleChange(e, setter, fieldName)}
        >
          <option value="" disabled hidden>
            Оберіть постачальника
          </option>
          {allSuppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
      </label>

      <br />
      <label>
        Brand:{" "}
        <select
          name="brandId"
          value={data.brandId}
          onChange={(e) => handleChange(e, setter, fieldName)}
        >
          <option value="" disabled hidden>
            -- Оберіть бренд --
          </option>
          {allBrands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </label>
      <br />
    </fieldset>
  );
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
      {isLoading ? (
        <div style={{ marginTop: "1rem" }}>
          <p>⏳ Будь ласка, зачекайте...</p>
          <div className="loader"></div>
        </div>
      ) : (
        <>
          <div
            style={{ display: "flex", alignItems: "flex-start", gap: "2rem" }}
          >
            {/* Основна форма */}
            <div style={{ flex: 1 }}>
              <h2>🛠️ Початкове заповнення комплекту</h2>
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  gap: "2rem",
                  alignItems: "flex-start",
                }}
              >
                {renderGroup(
                  "🔩 Державка",
                  toolHolder,
                  setToolHolder,
                  "toolHolder"
                )}
                {renderGroup(
                  "🛠️ Інструмент",
                  instrument,
                  setInstrument,
                  "instrument"
                )}
                {renderGroup("🔗 Адаптер", adapter, setAdapter, "adapter")}

                <button type="submit">💾 Зберегти комплект</button>
              </form>
            </div>
            {isAdmin && (
              <div
                style={{
                  width: "300px",
                  padding: "1rem",
                  borderLeft: "1px solid #ccc",
                }}
              >
                <h3>👤 Додати постачальника</h3>

                <label>
                  Назва:{" "}
                  <input
                    name="name"
                    value={supplier.name}
                    onChange={(e) => handleChange(e, setSupplier)}
                  />
                </label>
                <br />

                <label>
                  Email:{" "}
                  <input
                    name="email"
                    value={supplier.email}
                    onChange={(e) => handleChange(e, setSupplier)}
                  />
                </label>
                <br />

                <label>
                  Телефон:{" "}
                  <input
                    name="mobile"
                    value={supplier.mobile}
                    onChange={(e) => handleChange(e, setSupplier)}
                  />
                </label>
                <br />

                {/* ✅ Код ЄДРПОУ */}
                <label>
                  Код ЄДРПОУ:{" "}
                  <input
                    name="edrpou"
                    value={supplier.edrpou}
                    onChange={(e) => handleChange(e, setSupplier)}
                  />
                </label>
                <br />

                {/* ✅ Адреса */}
                <label>
                  Адреса:{" "}
                  <input
                    name="address"
                    value={supplier.address}
                    onChange={(e) => handleChange(e, setSupplier)}
                  />
                </label>
                <br />

                <button
                  onClick={handleAddSupplier}
                  style={{ marginTop: "0.5rem" }}
                >
                  ➕ Додати постачальника
                </button>

                <hr style={{ margin: "1rem 0" }} />

                <h3>🏷️ Додати бренд</h3>
                <label>
                  Назва бренда:{" "}
                  <input
                    name="name"
                    value={brand.name}
                    onChange={(e) => handleChange(e, setBrand)}
                  />
                </label>
                <br />
                <button
                  onClick={handleAddBrand}
                  style={{ marginTop: "0.5rem" }}
                >
                  ➕ Додати бренд
                </button>
              </div>
            )}
          </div>

          <div style={{ marginTop: "2rem" }}>
            <h3>📜 Історія створених комплектів</h3>
            {setHistory.length === 0 ? (
              <p>Наразі ще немає створених комплектів.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                {/* Заголовки колонок */}
                <div
                  style={{
                    display: "flex",
                    gap: "2rem",
                    padding: "1rem",
                    fontWeight: "bold",
                    borderBottom: "2px solid #000",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  <div>#</div>
                  <div>Дата</div>
                  <div>Деталь</div>
                  <div>Зображення</div>
                  <div>Тип обробки</div>
                  <div>Державка</div>
                  <div>Інструмент</div>
                  <div>Адаптер</div>
                  <div>✔</div>
                </div>
                {setHistory.map((item, index) => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        gap: "2rem",
                        padding: "1rem",
                        borderBottom: "1px solid #ccc",
                        alignItems: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <div>
                        <strong>#{item.id}</strong>
                      </div>
                      <div>{item.date}</div>
                      <div>{item.detail}</div>
                      <div>
                        {item.image ? (
                          <img
                            src={item.image}
                            alt="Тип обробки"
                            style={{ height: "40px" }}
                          />
                        ) : (
                          "—"
                        )}
                      </div>
                      <div>{item.processingName}</div>
                      <div>{item.toolHolder}</div>
                      <div>{item.instrument}</div>
                      <div>{item.adapter}</div>
                    </div>
                    {/* ✅ Чекбокс справа */}
                    <div style={{}}>
                      <input
                        type="checkbox"
                        checked={selectedSetIds.includes(item.id)}
                        onChange={() => toggleSelection(item.id)}
                      />
                    </div>
                    {showRating && selectedSetIds.includes(item.id) && (
                      <StarRating
                        setId={item.id}
                        initial={ratings[item.id] || 0}
                        onSubmit={async (id, value) => {
                          // сохрани на бэке
                          await fetch(`${S_URL}/api/set/${id}/rate`, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${localStorage.getItem(
                                "token"
                              )}`,
                            },
                            body: JSON.stringify({ setId: id, rating: value }),
                          })
                            .then((res) => res.json())
                            .then((data) => {
                              if (data) {
                                console.log(data);
                              }
                            })
                            .catch((e) => alert("error"));
                        }}
                      />
                    )}
                  </div>
                ))}
                <button onClick={() => setShowRating(true)}>
                  ⭐ Оцінити вибрані
                </button>
              </div>
            )}
          </div>
          {mode === "view" && (
            <div style={{ marginTop: "2rem" }}>
              <h3>🔎 Рекомендовані комплекти</h3>
              {suggestedSets.length === 0 ? (
                <p>Немає знайдених комплектів за вказаними параметрами.</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  {suggestedSets.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        gap: "2rem",
                        padding: "1rem",
                        borderBottom: "1px solid #ccc",
                        alignItems: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item?.toolHolder && (
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
                              selectedSetItems[index]?.toolHolder || false
                            }
                            onChange={() =>
                              toggleSetItemSelection(index, "toolHolder")
                            }
                            style={{ accentColor: "green" }}
                          />
                        </div>
                      )}
                      {item?.instrument && (
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
                              selectedSetItems[index]?.instrument || false
                            }
                            onChange={() =>
                              toggleSetItemSelection(index, "instrument")
                            }
                            style={{ accentColor: "green" }}
                          />
                        </div>
                      )}
                      {item?.toolAdapter && (
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
                              selectedSetItems[index]?.toolAdapter || false
                            }
                            onChange={() =>
                              toggleSetItemSelection(index, "toolAdapter")
                            }
                            style={{ accentColor: "green" }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
            </div>
          )}
          {/* {mode === "statements" && (
            <StatementBuilder
              groupedStatements={groupedStatements}
              onBack={() => setMode("view")} // повернення назад
            />
          )} */}
        </>
      )}
    </div>
  );
}

export default SetForm;
