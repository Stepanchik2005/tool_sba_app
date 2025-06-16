import React, { useEffect, useState, useRef } from "react";
import { S_URL } from "./constants";
import { data } from "react-router-dom";
import { inflect } from "@yar.ua/numerals/lib/grammar.js";
import html2pdf from "html2pdf.js";
import { inflect_cardinal, inflect_decimal } from "@yar.ua/numerals";
export default function StatementBuilder({ groupedStatements, onBack }) {
  const [edpouSupplierValue, setSupplierEdpouValue] = useState();
  const [emailSupplierValue, setSupplierEmailValue] = useState();
  const [mobileSupplierValue, setSupplierMobileValue] = useState();
  const [addressSupplierValue, setSupplierAddressValue] = useState();

  const [edpouCustomerValue, setCustomerEdpouValue] = useState();
  const [emailCustomerValue, setCustomerEmailValue] = useState();
  const [mobileCustomerValue, setCustomerMobileValue] = useState();
  const [addressCustomerValue, setCustomerAddressValue] = useState();
  const [enterpriseNameCustomerValue, setEnterpriseNameCustomerValue] =
    useState();
  const [fullNameCustomerValue, setFullNameCustomerValue] = useState();

  const [quantities, setQuantites] = useState([]);
  const supplierIds = Object.keys(groupedStatements);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSupplierId = supplierIds[currentIndex];
  const items = groupedStatements[currentSupplierId];
  const supplier = items[0]?.supplier; // беремо дані постачальника з першого айтему

  const [overallPrice, setOverallPrice] = useState(0);

  const setDate = new Date().toLocaleDateString("uk-UA");
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "2rem",
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
    textAlign: "center",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  };
  const thStyle = {
    padding: "0.5rem",
    border: "1px solid #ccc",
    textAlign: "center",
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  };
  const tdStyle = {
    padding: "0.5rem",
    border: "1px solid #ccc",
    textAlign: "center",
  };
  const inputStyle = {
    width: "100%",
    maxWidth: "400px", // обмеження максимальної ширини
    padding: "0.5rem",
    marginBottom: "1rem",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    fontWeight: "bold",
    marginBottom: "0.25rem",
    display: "block",
  };

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Якщо постачальник уже ініціалізований — виходимо
    if (!items || !supplier || !user) return;

    // Заповнення кількості
    setQuantites(items.map(() => 1));

    // Постачальник
    setSupplierEdpouValue(supplier.edpou || "");
    setSupplierEmailValue(supplier.email || "");
    setSupplierMobileValue(supplier.mobile || "");
    setSupplierAddressValue(supplier.address || "");

    // Замовник
    setCustomerEmailValue(user.email || "");
    setCustomerAddressValue(user.address || "");
    setEnterpriseNameCustomerValue(user.enterpriseName || "");
    setCustomerMobileValue(user.mobile || "");
    setCustomerEdpouValue(user.edpou || "");
    setFullNameCustomerValue(user.fullName || "");
  }, [currentSupplierId]);

  useEffect(() => {
    if (items.length > 0 && quantities.length === items.length) {
      const total = items.reduce((sum, item, idx) => {
        const qty = quantities[idx] || 0;
        const price = parseFloat(item.websiteData.price) || 0;
        return sum + qty * price;
      }, 0);
      setOverallPrice(total);
    }
  }, [quantities, items]);

  const handleNext = () => {
    if (currentIndex < supplierIds.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      alert("✅ Усі відомості переглянуто");
      onBack(); // Повернення до вибору
    }
  };
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const sendEmail = () => {
    const originalContent = document.getElementById("emailContent");

    // Создаем копию DOM
    const clone = originalContent.cloneNode(true);

    // Заменяем все inputs внутри копии на их значения
    clone.querySelectorAll("input[type='number']").forEach((input) => {
      const td = input.parentElement;
      const value = input.value;
      td.innerHTML = value; // вставляем просто число вместо input
    });

    // Получаем финальный HTML
    const dataHtml = clone.innerHTML;
    if (!emailSupplierValue || !emailCustomerValue) {
      alert("Email одержувача або відправника не вказано!");
      return;
    }

    const payload = {
      to: emailSupplierValue,
      subject: "",
      replyTo: emailCustomerValue,
      dataHtml: dataHtml,
    };

    fetch(`${S_URL}/api/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`❌ Сервер повернув ${res.status}`);
        }
        return res.json();
      })
      .then((res) => alert(res.message))
      .catch((e) => alert(e.message));
  };
  const handleQunatityChange = (index, newValue) => {
    const updated = [...quantities];
    updated[index] = parseInt(newValue) || 0;
    setQuantites(updated);
  };

  function fixLastWordGender(text) {
    const words = text.trim().split(/\s+/);
    const last = words[words.length - 1];

    if (last === "один") words[words.length - 1] = "одна";
    if (last === "два") words[words.length - 1] = "дві";

    return words.join(" ");
  }

  const toWordsUah = (value) => {
    if (!value) return "";

    const [hryvnias, kopiykyRaw] = String(value).split(".");
    const kopiyky = (kopiykyRaw || "00").padEnd(2, "0").slice(0, 2);

    const hryvniasText =
      inflect_cardinal(hryvnias, "nomn") +
      " грив" +
      getCurrencyHryvniasEnding(hryvnias);

    const kopiykyRawText = inflect_cardinal(kopiyky, "genitive");

    const kopiykyText =
      fixLastWordGender(kopiykyRawText) +
      " копій" +
      getCurrencyCoinsEnding(kopiyky);

    return `${hryvniasText} ${kopiykyText}`;
  };

  // Функція для узгодження закінчень "гривня/гривні/гривень"
  function getCurrencyHryvniasEnding(numberStr) {
    const n = parseInt(numberStr, 10);
    //const lastTwo = n % 100;
    const lastOne = n % 10;

    // if (lastTwo >= 11 && lastTwo <= 14) return "ень";
    if (lastOne === 1) return "ня";
    if (lastOne >= 2 && lastOne <= 4) return "ні";
    return "ень";
  }
  // Функція для узгодження закінчень "гривня/гривні/гривень"
  function getCurrencyCoinsEnding(numberStr) {
    const n = parseInt(numberStr, 10);
    const lastTwo = n % 100;
    const lastOne = n % 10;

    //if (lastTwo >= 11 && lastTwo <= 14) return "ень";
    if (lastOne === 1) return "ка";
    if (lastOne >= 2 && lastOne <= 4) return "ки";
    return "ок";
  }
  const exportRef = useRef(); // зверху, перед return

  return (
    <div style={{ padding: "2rem" }}>
      <h3>📄 Відомість для постачальника: {supplier?.name}</h3>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "3rem",
          padding: "2rem 0",
          flexWrap: "wrap",
        }}
      >
        {/* Постачальник */}
        <div style={{ flex: "1", minWidth: "280px" }}>
          <h3>📄 Дані постачальника</h3>
          <label style={labelStyle}>ЄДРПОУ:</label>
          <input
            style={inputStyle}
            value={edpouSupplierValue}
            onChange={(e) => setSupplierEdpouValue(e.target.value)}
          />
          <label style={labelStyle}>Email:</label>
          <input
            style={inputStyle}
            value={emailSupplierValue}
            onChange={(e) => setSupplierEmailValue(e.target.value)}
          />
          <label style={labelStyle}>Телефон:</label>
          <input
            style={inputStyle}
            value={mobileSupplierValue}
            onChange={(e) => setSupplierMobileValue(e.target.value)}
          />
          <label style={labelStyle}>Адреса:</label>
          <input
            style={inputStyle}
            value={addressSupplierValue}
            onChange={(e) => setSupplierAddressValue(e.target.value)}
          />
        </div>

        {/* Замовник */}
        <div style={{ flex: "1", minWidth: "280px" }}>
          <h3>📄 Дані замовника</h3>
          <label style={labelStyle}>Повна назва підприємства:</label>
          <input
            style={inputStyle}
            value={enterpriseNameCustomerValue}
            onChange={(e) => setEnterpriseNameCustomerValue(e.target.value)}
          />
          <label style={labelStyle}>Адреса:</label>
          <input
            style={inputStyle}
            value={addressCustomerValue}
            onChange={(e) => setCustomerAddressValue(e.target.value)}
          />
          <label style={labelStyle}>ЄДРПОУ:</label>
          <input
            style={inputStyle}
            value={edpouCustomerValue}
            onChange={(e) => setCustomerEdpouValue(e.target.value)}
          />
          <label style={labelStyle}>ПІБ:</label>
          <input
            style={inputStyle}
            value={fullNameCustomerValue}
            onChange={(e) => setFullNameCustomerValue(e.target.value)}
          />
          <label style={labelStyle}>Email:</label>
          <input
            style={inputStyle}
            value={emailCustomerValue}
            onChange={(e) => setCustomerEmailValue(e.target.value)}
          />
          <label style={labelStyle}>Телефон:</label>
          <input
            style={inputStyle}
            value={mobileCustomerValue}
            onChange={(e) => setCustomerMobileValue(e.target.value)}
          />
        </div>
      </div>
      <div ref={exportRef}>
        <div id="emailContent" style={{ width: "100%" }}>
          <p>
            Запит № на отримання рахунку Просимо, виставити рахунок, та за
            потреби уточнити актуальні ціні, з урахуванням кількості та
            наявності, для придбання товарів згідно переліку:
          </p>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th colSpan="2" style={thStyle}>
                  Постачальник
                </th>
                <th colSpan="2" style={thStyle}>
                  Замовник
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>Офіційна назва постачальника:</td>
                <td style={tdStyle}>{supplier?.name}</td>
                <td style={tdStyle}>Назва підприємства</td>
                <td style={tdStyle}>{enterpriseNameCustomerValue}</td>
              </tr>
              <tr>
                <td style={tdStyle}>Код ЄДРПОУ:</td>
                <td style={tdStyle}>{edpouSupplierValue}</td>
                <td style={tdStyle}>Юридична адреса</td>
                <td style={tdStyle}>{addressCustomerValue}</td>
              </tr>
              <tr>
                <td style={tdStyle}>Адреса:</td>
                <td style={tdStyle}>{addressSupplierValue}</td>
                <td style={tdStyle}>ЄДРПОУ/ІПН</td>
                <td style={tdStyle}>{edpouCustomerValue}</td>
              </tr>
              <tr>
                <td style={tdStyle}>Тел.:</td>
                <td style={tdStyle}>{mobileSupplierValue}</td>
                <td style={tdStyle}>ПІБ</td>
                <td style={tdStyle}>{fullNameCustomerValue}</td>
              </tr>
              <tr>
                <td style={tdStyle}>Email:</td>
                <td style={tdStyle}>{emailSupplierValue}</td>
                <td style={tdStyle}>Контактний номер телефону</td>
                <td style={tdStyle}>{mobileCustomerValue}</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td style={tdStyle}>Email</td>
                <td style={tdStyle}>{emailCustomerValue}</td>
              </tr>
            </tbody>
          </table>
          <p>
            Просимо, виставити рахунок, та за потреби уточнити актуальні ціні, з
            урахуванням кількості та наявності, для придбання товарів згідно
            переліку:
          </p>

          <table style={tableStyle}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={thStyle}>№ п/п</th>
                <th style={thStyle}>Назва товару</th>
                <th style={thStyle}>Маркування</th>
                <th style={thStyle}>Артикул</th>
                <th style={thStyle}>Од. виміру</th>
                <th style={thStyle}>Кількість</th>
                <th style={thStyle}>Ціна без ПДВ, грн</th>
                <th style={thStyle}>Сума без ПДВ, грн</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #ccc" }}>
                  <td style={tdStyle}>{idx + 1}</td>
                  <td style={tdStyle}>{item.name}</td>
                  <td style={tdStyle}>{item.marking}</td>
                  <td style={tdStyle}>{item.articleNumber}</td>
                  <td style={tdStyle}>шт</td>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      min="1"
                      value={quantities[idx]}
                      onChange={(e) =>
                        handleQunatityChange(idx, e.target.value)
                      }
                      style={{ width: "auto", textAlign: "center" }}
                    />
                  </td>
                  <td style={tdStyle}>{item.websiteData.price}</td>
                  <td style={tdStyle}>
                    {parseFloat(
                      quantities[idx] * parseFloat(item.websiteData.price)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <p>
            Разом без ПДВ: <b>{overallPrice.toFixed(2)} грн</b>
          </p>
          <p>
            ПДВ 20%: <b>{(overallPrice * 0.2).toFixed(2)} грн</b>
          </p>
          <p>
            Всього з ПДВ: <b>{(overallPrice * 1.2).toFixed(2)} грн</b>
          </p>
          <p>
            Сума прописом:
            <b>{toWordsUah("2236.52")}</b>
          </p>
          <p>
            Погодив:
            <b>{fullNameCustomerValue}</b>
          </p>
          <p>
            Дата:
            <b>{setDate}</b>
          </p>
        </div>
      </div>
      <button
        onClick={() => {
          html2pdf()
            .set({
              margin: 10,
              filename: "statement.pdf",
              html2canvas: {
                scale: 2, // збільшення якості
                scrollX: 0,
                scrollY: 0,
                windowWidth: 1200, // ширше вікно для рендеру
              },
              jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "landscape", // 👉 якщо таблиця дуже широка
              },
            })
            .from(exportRef.current)
            .save();
        }}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        📄 Завантажити PDF
      </button>
      <button
        onClick={() => {
          const printContent = exportRef.current.innerHTML;
          const win = window.open("", "_blank");
          win.document.writeln(`
      <html>
        <head>
          <title>Друк запиту</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { border-collapse: collapse; width: 100%; font-size: 14px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
            th { background-color: #f0f0f0; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
          win.document.close();
          win.focus();
          win.print();
          // win.close();
        }}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#343a40",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        🖨️ Друкувати
      </button>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "2rem",
        }}
      >
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: currentIndex === 0 ? "#ccc" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: currentIndex === 0 ? "not-allowed" : "pointer",
          }}
        >
          ⬅️ Назад
        </button>
        <button
          onClick={sendEmail}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "red",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Надіслати письмо
        </button>
        <button
          onClick={handleNext}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ➡️ Далі
        </button>
      </div>
    </div>
  );
}
