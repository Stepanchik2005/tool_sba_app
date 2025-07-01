import React, { useState, useEffect, useNavigate } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { S_URL } from "./components/constants";
import LoginForm from "./components/LoginForm";
import AppMenu from "./components/AppMenu";

import SelectEnterprise from "./components/SelectEnterprise";
import MaterialForm from "./components/MaterialForm";
import UserDashboard from "./components/UserDashboard"; // або шлях до твого компонента
import PrivateRoute from "./components/PrivateRoot";
import DetailForm from "./components/DetailForm";

import MachineForm from "./components/MachineForm";
import ProcessingForm from "./components/ProcessingForm";
import SetForm from "./components/SetForm";

import StatementBuilder from "./components/StatementBuilder";
//const S_URL = "http://localhost:8080";

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
    localStorage.clear(); // або .removeItem(...) кілька разів
    setIsLoggedIn(false);
  };

  if (isAuthLoading) return null; // або <div>Завантаження...</div>

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/app-menu" replace />
            ) : (
              <Navigate to="/login-form" replace />
            )
          }
        />
        <Route path="/select-enterprise" element={<SelectEnterprise />} />

        <Route
          path="/app-menu"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <AppMenu onLogout={handleLogout} />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="details" replace />} />
          <Route path="materials" element={<MaterialForm />} />
          <Route path="details" element={<DetailForm />} />
          <Route path="machines" element={<MachineForm />} />
          <Route path="processing" element={<ProcessingForm />} />
          <Route path="set" element={<SetForm />} />
          <Route
            path="statements"
            element={
              <StatementBuilder onBack={() => Navigate("/app-menu/set")} />
            }
          />
        </Route>

        <Route
          path="/login-form"
          element={
            isLoggedIn ? (
              <Navigate to="/app-menu" replace />
            ) : (
              <LoginForm onLogin={() => setIsLoggedIn(true)} />
            )
          }
        />
        <Route path="/cabinet" element={<UserDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
