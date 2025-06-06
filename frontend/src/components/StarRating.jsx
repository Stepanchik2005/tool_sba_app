import React, { useState } from "react";

const StarRating = ({ setId, initial = 0, onSubmit }) => {
  const [rating, setRating] = useState(initial);
  const [saved, setSaved] = useState(false);

  const stars = [1, 2, 3, 4, 5];

  const handleRate = async (star) => {
    setRating(star);
    setSaved(false);
    if (onSubmit) {
      try {
        await onSubmit(setId, star); // callback передаётся снаружи
        setSaved(true);
      } catch (err) {
        alert("❌ Помилка збереження рейтингу");
      }
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {stars.map((star) => (
        <span
          key={star}
          style={{
            fontSize: "24px",
            cursor: "pointer",
            color: star <= rating ? "#ffc107" : "#ccc",
          }}
          onClick={() => handleRate(star)}
        >
          ★
        </span>
      ))}
      {saved && <span style={{ color: "green" }}>✔</span>}
    </div>
  );
};

export default StarRating;
