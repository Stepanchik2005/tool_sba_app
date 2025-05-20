import React, { useState } from "react";
import SHA256 from "crypto-js/sha256";

const S_URL = "http://100.104.181.58:8080";

function LoginForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Паролі не співпадають");
      return;
    }

    const hashedPassword = SHA256(formData.password).toString();

    const payload = {
      email: formData.email,
      password: hashedPassword,
      ...(isLogin ? {} : { username: formData.username }),
    };

    fetch(`${S_URL}/api/${isLogin ? "login" : "register"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.clear();
        if (data.token) {
          localStorage.setItem("token", data.token);
          fetch(`${S_URL}/api/secure`, {
            method: "GET",
            headers: { Authorization: `Bearer ${data.token}` },
          })
            .then((r) => r.json())
            .then(console.log)
            .catch((err) => console.error("Помилка доступу:", err));
          onLogin();
        } else if (!isLogin) {
          alert("✅ Реєстрація успішна!");
          setIsLogin(true);
        } else {
          setError("Невірні дані");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Помилка підключення");
      });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {!isLogin && (
        <input
          type="text"
          name="username"
          placeholder="Імʼя"
          value={formData.username}
          onChange={handleChange}
          required
        />
      )}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Пароль"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Підтвердження"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit">{isLogin ? "Увійти" : "Зареєструватись"}</button>
      <button
        type="button"
        onClick={() => setIsLogin(!isLogin)}
        className="toggle"
      >
        {isLogin ? "Ще немає акаунту?" : "Уже зареєстрований?"}
      </button>
    </form>
  );
}

export default LoginForm;
