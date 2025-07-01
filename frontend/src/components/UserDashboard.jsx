import React, { useEffect, useState } from "react";
import { S_URL } from "./constants";

export default function UserDashboard() {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });

  if (!user) {
    return <p>⏳ Завантаження кабінету...</p>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2>👤 Особистий кабінет</h2>
      <p>
        <strong>ПІБ:</strong> {user.fullName}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Підприємство:</strong> {user.enterpriseName}
      </p>
      <p>
        <strong>Телефон:</strong> {user.mobile}
      </p>
    </div>
  );
}
