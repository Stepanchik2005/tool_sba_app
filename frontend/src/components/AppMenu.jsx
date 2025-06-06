import React, { useState } from "react";
import MaterialForm from "./MaterialForm";
import DetailForm from "./DetailForm";
import MachineForm from "./MachineForm";
import ProcessingForm from "./ProcessingForm";
import SetForm from "./SetForm"; // ✅ підключаємо нову форму

import "../style.css";

function AppMenu({ onLogout, userDetails, userMachines }) {
  const [section, setSection] = useState("materials");

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
        }}
      >
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

      {/* Основная часть (вкладки + контент) */}
      <div style={{ display: "flex", flexGrow: 1 }}>
        {/* Левая панель вкладок */}
        <div className="sidebar">
          <button
            onClick={() => setSection("materials")}
            className={`tab-btn ${section === "materials" ? "active" : ""}`}
          >
            🧪 Матеріал
          </button>
          <button
            onClick={() => setSection("details")}
            className={`tab-btn ${section === "details" ? "active" : ""}`}
          >
            📦 Деталь
          </button>
          <button
            onClick={() => setSection("machines")}
            className={`tab-btn ${section === "machines" ? "active" : ""}`}
          >
            🛠️ Верстат
          </button>
          <button
            onClick={() => setSection("processing")}
            className={`tab-btn ${section === "processing" ? "active" : ""}`}
          >
            ⚙️ Тех. рішення
          </button>
          <button
            onClick={() => setSection("set")}
            className={`tab-btn ${section === "set" ? "active" : ""}`}
          >
            🔗 Комплект
          </button>
        </div>

        {/* Контент */}
        <div
          style={{
            flexGrow: 1,
            padding: "2rem",
            overflowX: "auto",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          {section === "materials" && <MaterialForm />}
          {section === "details" && <DetailForm />}
          {section === "machines" && <MachineForm />}
          {section === "processing" && <ProcessingForm />}
          {section === "set" && <SetForm />} {/* ✅ нова секція */}
        </div>
      </div>
    </div>
  );
}

export default AppMenu;
