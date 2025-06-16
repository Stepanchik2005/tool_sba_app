import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

import "../style.css";

function AppMenu({ onLogout, userDetails, userMachines }) {
  const location = useLocation();
  // const [section, setSection] = useState("details");

  const section = location.pathname.split("/")[2] || "details"; // отримуємо вкладку з URL
  const navigate = useNavigate(); // 🆕
  const changeSection = (name) => navigate(`/app-menu/${name}`);
  useEffect(() => {
    changeSection("details");
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Верхняя панель */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "1rem",
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #ddd",
          gap: "1rem", // 🆕 щоб між кнопками був відступ
        }}
      >
        <button
          onClick={() => navigate("/cabinet")} // 🆕 кнопка кабінету
          style={{
            background: "#007bff",
            color: "#fff",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          👤 Кабінет
        </button>

        <button
          onClick={onLogout}
          style={{
            background: "#f33",
            color: "#fff",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          🚪 Вийти
        </button>
      </div>

      {/* Основна частина і вкладки залишаються без змін */}
      <div style={{ display: "flex", flexGrow: 1 }}>
        <div className="sidebar">
          <button
            onClick={() => changeSection("details")}
            className={`tab-btn ${section === "details" ? "active" : ""}`}
          >
            📦 Деталь
          </button>
          <button
            onClick={() => changeSection("materials")}
            className={`tab-btn ${section === "materials" ? "active" : ""}`}
          >
            🧪 Матеріал
          </button>
          <button
            onClick={() => changeSection("machines")}
            className={`tab-btn ${section === "machines" ? "active" : ""}`}
            disabled={!localStorage.getItem("selectedMaterial")}
          >
            🛠️ Верстат
          </button>
          <button
            onClick={() => changeSection("processing")}
            className={`tab-btn ${section === "processing" ? "active" : ""}`}
            disabled={!localStorage.getItem("selectedMaterial")}
          >
            ⚙️ Технологічна ситуація
          </button>
          <button
            onClick={() => changeSection("set")}
            className={`tab-btn ${section === "set" ? "active" : ""}`}
            disabled={
              !JSON.parse(localStorage.getItem("technical-situation")) == true
            }
          >
            🔗 Технологічне рішення
          </button>
          <button
            onClick={() => changeSection("statements")}
            className={`tab-btn ${section === "statements" ? "active" : ""}`}
            disabled={!localStorage.getItem("setStatementsData")} // активна тільки якщо є відомості
          >
            📄 Відомості
          </button>
        </div>

        <div
          style={{
            flexGrow: 1,
            padding: "2rem",
            overflowX: "auto",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AppMenu;
