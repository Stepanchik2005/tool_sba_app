import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import AppMenu from "./components/AppMenu";

const S_URL = "http://localhost:8080";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // 🔐 Проверка токена при загрузке
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch(`${S_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then(() => setIsLoggedIn(true))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setIsAuthLoading(false));
    } else {
      setIsAuthLoading(false);
    }
  }, []);

  // 🚪 Вийти
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("selectedDetail");
    setIsLoggedIn(false);
  };

  if (isAuthLoading) return null; // або <div>Завантаження...</div>

  return isLoggedIn ? (
    <AppMenu onLogout={handleLogout} />
  ) : (
    <LoginForm onLogin={() => setIsLoggedIn(true)} />
  );
}

export default App;
