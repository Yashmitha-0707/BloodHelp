
"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // Store the form before the asynchronous operations
    const form = event.currentTarget;

    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const formData = new FormData(form);

      // Get CSRF token
      const csrfResponse = await fetch(
        "http://localhost:8080/api/csrf",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!csrfResponse.ok) {
        throw new Error("Unable to get security token.");
      }

      const csrfData = await csrfResponse.json();

      // Register donor in Java backend
      const response = await fetch(
        "http://localhost:8080/api/donors",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            [csrfData.headerName]: csrfData.token,
          },
          body: JSON.stringify({
            name: formData.get("name"),
            age: Number(formData.get("age")),
            bloodGroup: formData.get("bloodGroup"),
            phone: formData.get("phone"),
            city: formData.get("city"),
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      if (
        response.redirected ||
        !contentType.includes("application/json")
      ) {
        throw new Error("Please log in to Java first.");
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof result === "string"
            ? result
            : "Donor registration failed."
        );
      }

      // Registration successful
      setSuccess(true);

      // Reset the form safely
      form.reset();

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          font-family: Arial, sans-serif;
          background: #fff5f5;
          min-height: 100vh;
          margin: 0;
          padding: 20px;
        }

        .container {
          background: white;
          max-width: 450px;
          margin: 30px auto;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 3px 15px #00000020;
        }

        h1 {
          color: #c62828;
          text-align: center;
        }

        p {
          text-align: center;
        }

        label {
          display: block;
          margin-top: 15px;
          font-weight: bold;
        }

        input, select {
          width: 100%;
          padding: 12px;
          margin-top: 7px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 15px;
        }

        button {
          width: 100%;
          padding: 13px;
          margin-top: 25px;
          background: #c62828;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
        }

        button:hover {
          background: #a51d1d;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error {
          color: red;
          font-weight: bold;
        }

        .success {
          color: green;
          font-weight: bold;
        }

        a {
          color: #c62828;
          text-decoration: none;
        }

        .links {
          text-align: center;
          margin-top: 20px;
        }
      `}</style>

      <div className="page">
        <div className="container">

          <h1>❤️ BloodHelp</h1>
          <p>Become a Blood Donor</p>

          {error && <p className="error">{error}</p>}

          {success && (
            <p className="success">
              Donor registered successfully!
            </p>
          )}

          <form onSubmit={handleRegister}>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              required
            />

            <label>Age</label>
            <input
              type="number"
              name="age"
              min={18}
              max={65}
              placeholder="Enter your age"
              required
            />

            <label>Blood Group</label>
            <select name="bloodGroup" required defaultValue="">
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>

            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter 10-digit phone number"
              pattern="[0-9]{10}"
              maxLength={10}
              required
            />

            <label>City</label>
            <input
              type="text"
              name="city"
              placeholder="Enter your city"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register as Donor"}
            </button>
          </form>

          <div className="links">
            <p><a href="/">Back to Home</a></p>
            <p><a href="/search">Search Blood Donors</a></p>
          </div>

        </div>
      </div>
    </>
  );
}
