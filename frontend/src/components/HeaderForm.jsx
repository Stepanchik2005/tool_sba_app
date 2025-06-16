import React, { useEffect, useState } from "react";

export default function HeaderForm() {
  const [supplier, setSupplier] = useState({
    name: "",
    edrpou: "",
    address: "",
    mobile: "",
    email: "",
  });

  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    edrpou: "",
    contactPerson: "",
    mobile: "",
    email: "",
  });

  useEffect(() => {
    const savedSupplier = JSON.parse(localStorage.getItem("supplierInfo"));
    const savedCustomer = JSON.parse(localStorage.getItem("customerInfo"));

    if (savedSupplier) setSupplier(savedSupplier);
    if (savedCustomer) setCustomer(savedCustomer);
  }, []);

  const handleChange = (e, target, setter) => {
    setter((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div style={{ display: "flex", gap: "2rem", padding: "1rem" }}>
      {/* Постачальник */}
      <div>
        <h3>📦 Постачальник</h3>
        <label>
          Назва:
          <input
            name="name"
            value={supplier.name}
            onChange={(e) => handleChange(e, supplier, setSupplier)}
          />
        </label>
        <br />
        <label>
          ЄДРПОУ:
          <input
            name="edrpou"
            value={supplier.edrpou}
            onChange={(e) => handleChange(e, supplier, setSupplier)}
          />
        </label>
        <br />
        <label>
          Адреса:
          <input
            name="address"
            value={supplier.address}
            onChange={(e) => handleChange(e, supplier, setSupplier)}
          />
        </label>
        <br />
        <label>
          Телефон:
          <input
            name="mobile"
            value={supplier.mobile}
            onChange={(e) => handleChange(e, supplier, setSupplier)}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            name="email"
            value={supplier.email}
            onChange={(e) => handleChange(e, supplier, setSupplier)}
          />
        </label>
      </div>

      {/* Замовник */}
      <div>
        <h3>🏢 Замовник</h3>
        <label>
          Назва:
          <input
            name="name"
            value={customer.name}
            onChange={(e) => handleChange(e, customer, setCustomer)}
          />
        </label>
        <br />
        <label>
          Адреса:
          <input
            name="address"
            value={customer.address}
            onChange={(e) => handleChange(e, customer, setCustomer)}
          />
        </label>
        <br />
        <label>
          ЄДРПОУ / ІПН:
          <input
            name="edrpou"
            value={customer.edrpou}
            onChange={(e) => handleChange(e, customer, setCustomer)}
          />
        </label>
        <br />
        <label>
          Контактна особа:
          <input
            name="contactPerson"
            value={customer.contactPerson}
            onChange={(e) => handleChange(e, customer, setCustomer)}
          />
        </label>
        <br />
        <label>
          Телефон:
          <input
            name="phone"
            value={customer.mobile}
            onChange={(e) => handleChange(e, customer, setCustomer)}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            name="email"
            value={customer.email}
            onChange={(e) => handleChange(e, customer, setCustomer)}
          />
        </label>
      </div>
    </div>
  );
}
