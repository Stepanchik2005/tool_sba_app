import React, { useEffect, useState } from "react";
import { S_URL } from "./constants";
export default function EmailVerification({ userEmail, onVerified }) {
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    handleSendCodeAgain();
  }, []);

  const handleSendCodeAgain = async () => {
    try {
      const res = await fetch(`${S_URL}/api/auth/send-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });
      const data = await res.json();
      setMessage(data.message || "Код надіслано");
    } catch (err) {
      setMessage("❌ Помилка при відправці коду");
    }
  };

  const handleVerifyCode = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch(`${S_URL}/api/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, code: code }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setMessage("✅ Email підтверджено!");
        console.log("Calling onVerified");
        onVerified(); // вызвать callback, если надо перейти дальше
      } else {
        setMessage(data.message || "❌ Невірний код");
      }
    } catch (err) {
      setMessage("❌ Помилка перевірки коду" + err.message);
    } finally {
      setIsVerifying(false);
    }
  };
  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h3>Підтвердження пошти</h3>
      <p>
        Код надіслано на: <b>{userEmail}</b>
      </p>

      <input
        type="text"
        placeholder="Введіть код"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <button onClick={handleVerifyCode} disabled={isVerifying}>
        {isVerifying ? "Перевірка..." : "Підтвердити"}
      </button>

      <button onClick={handleSendCodeAgain} style={{ marginLeft: "10px" }}>
        Надіслати знову
      </button>

      {message && <p style={{ marginTop: "10px", color: "gray" }}>{message}</p>}
    </div>
  );
}
