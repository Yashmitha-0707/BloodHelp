
"use client";

import { useState, type FormEvent } from "react";

export default function BloodRequestPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const requestData = {
      name: String(formData.get("name")),
      bloodGroup: String(formData.get("bloodGroup")),
      phone: String(formData.get("phone")),
      location: String(formData.get("location")),
      units: Number(formData.get("units")),
      message: String(formData.get("message")),
    };

    try {
      const csrfResponse = await fetch(
        "http://localhost:8080/api/csrf",
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!csrfResponse.ok) {
        throw new Error("Unable to get security token. Try again.");
      }

      const csrfData = await csrfResponse.json();

      const response = await fetch(
        "http://localhost:8080/api/blood-requests",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            [csrfData.headerName]: csrfData.token,
          },
          body: JSON.stringify(requestData),
        }
      );

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error("Unexpected server response. Check Java backend.");
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Blood request failed.");
      }

      setSuccess(result.message);
      form.reset();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #fff5f5;
          color: #333;
          min-height: 100vh;
        }

        header {
          background: #c62828;
          color: white;
          padding: 20px;
          text-align: center;
        }

        .container {
          max-width: 550px;
          margin: 35px auto;
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 15px #0002;
        }

        h2 {
          text-align: center;
          color: #c62828;
        }

        label {
          display: block;
          margin-top: 15px;
          font-weight: bold;
        }

        input, select, textarea {
          width: 100%;
          padding: 12px;
          margin-top: 7px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-family: Arial, sans-serif;
        }

        button {
          width: 100%;
          margin-top: 22px;
          padding: 13px;
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

        .back {
          display: block;
          text-align: center;
          margin-top: 20px;
          color: #c62828;
          text-decoration: none;
        }

        .message {
          text-align: center;
          margin-top: 15px;
          font-weight: bold;
        }

        .error {
          color: #c62828;
        }

        .success {
          color: green;
        }

        @media (max-width: 600px) {
          .container {
            margin: 20px;
            padding: 22px;
          }
        }
      `}</style>

      <div className="page">
        <header>
          <h1>BloodHelp</h1>
          <p>Request Blood - Save Lives</p>
        </header>

        <div className="container">
          <h2>Blood Request Form</h2>

          <form onSubmit={handleSubmit}>
            <label>Your Name</label>
            <input type="text" name="name" required />

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
              pattern="[0-9]{10}"
              maxLength={10}
              required
            />

            <label>Hospital / Location</label>
            <input type="text" name="location" required />

            <label>Units Required</label>
            <input
              type="number"
              name="units"
              min={1}
              required
            />

            <label>Additional Message</label>
            <textarea name="message" rows={4} />

            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Blood Request"}
            </button>
          </form>

          {error && <p className="message error">{error}</p>}
          {success && <p className="message success">{success}</p>}

          <a href="/" className="back">
            Back to Home
          </a>
        </div>
      </div>
    </>
  );
}
