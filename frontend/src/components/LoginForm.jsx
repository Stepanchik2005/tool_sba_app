import React, { useState } from "react";
import SHA256 from "crypto-js/sha256";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import EmailVerification from "./EmailVerification";
import SelectEnterprise from "./SelectEnterprise";
//const S_URL = "http://100.104.181.58:8080";

const S_URL = "http://localhost:8080";
function LoginForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    fullName: "",
  });
  const [error, setError] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("login"); // "login", "verify", "main"

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    //e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Паролі не співпадають");
      return;
    }

    const hashedPassword = SHA256(formData.password).toString();

    const payload = {
      email: formData.email,
      password: hashedPassword,
      ...(isLogin
        ? {}
        : {
            username: formData.username,
            fullName: formData.fullName,
            mobile: formData.mobile,
          }),
    };

    fetch(`${S_URL}/api/user/${isLogin ? "login" : "register"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.clear();

        if (data.token) {
          localStorage.setItem("token", data.token);
          // 🔻 Додай цей блок — одразу після входу отримаємо користувача
          fetch(`${S_URL}/api/user/me`, {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          })
            .then((res) => res.json())
            .then((userData) => {
              localStorage.setItem("user", JSON.stringify(userData));
              setUser(userData);
              // onLogin(); // 🔄 Піднімаємо стан isLoggedIn
              //setScreen("main");
            });
          if (isLogin) {
            onLogin();
          } else {
            setIsVerified(false);
            alert("✅ Реєстрація успішна!");
            setIsLogin(true);

            setScreen("select-enterprise");
          }
        } else {
          setError("Невірні дані");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Помилка підключення");
      });
  };
  if (screen === "verify") {
    return (
      <EmailVerification
        userEmail={formData.email}
        onVerified={() => {
          console.log("handleSubmit triggered!");
          // onLogin();
          // setScreen("select-enterprise");
          handleSubmit();
        }}
      />
    );
  }

  if (screen === "select-enterprise") {
    return <SelectEnterprise onCompleted={() => onLogin()} />;
  }
  return (
    <form className="login-form">
      {!isLogin && (
        <>
          <input
            type="text"
            name="username"
            placeholder="Імʼя користувача"
            value={formData.username}
            onChange={handleChange}
            required
          />

          {/* ✅ Повне імʼя */}
          <input
            type="text"
            name="fullName"
            placeholder="Повне імʼя"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <InputMask
            mask="+380 (99)-999-99-99"
            maskChar={null} // приховує підкреслення
            value={formData.mobile}
            onChange={handleChange}
          >
            {(inputProps) => (
              <input
                {...inputProps}
                type="tel"
                name="mobile"
                placeholder="+380 (__) - ___ - __ - __"
                required
              />
            )}
          </InputMask>
        </>
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
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault(); // обязательно!
          if (!isLogin) {
            setScreen("verify");
          } else {
            handleSubmit();
          }
        }}
      >
        {isLogin ? "Увійти" : "Зареєструватись"}
      </button>
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
