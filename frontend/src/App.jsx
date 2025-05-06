import React, { useState } from 'react';
import './style.css';
import SHA256 from 'crypto-js/sha256';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.includes('@')) {
      newErrors.email = 'Невірний email';
    }
    if (!isLogin && formData.username.trim().length < 3) {
      newErrors.username = "Ім'я має містити щонайменше 3 символи";
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Пароль має містити щонайменше 6 символів';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Паролі не співпадають';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      const hashedPassword = SHA256(formData.password).toString();
      console.log('Хеш паролю:', hashedPassword);
      alert(isLogin ? 'Вхід успішний (пароль хешовано у консолі)' : 'Реєстрація успішна (пароль хешовано у консолі)');
    }
  };

  return (
    <div className="container">
      <div className="form-toggle">
        <button
          className={isLogin ? 'active' : ''}
          onClick={() => {
            setIsLogin(true);
            setErrors({});
          }}
        >
          Вхід
        </button>
        <button
          className={!isLogin ? 'active' : ''}
          onClick={() => {
            setIsLogin(false);
            setErrors({});
          }}
        >
          Реєстрація
        </button>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              type="text"
              name="username"
              placeholder="Ім'я користувача"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {errors.username && <div className="error">{errors.username}</div>}
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
        {errors.email && <div className="error">{errors.email}</div>}
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {errors.password && <div className="error">{errors.password}</div>}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Підтвердити пароль"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
        <button type="submit">{isLogin ? 'Увійти' : 'Зареєструватися'}</button>
      </form>
    </div>
  );
}

export default App;
