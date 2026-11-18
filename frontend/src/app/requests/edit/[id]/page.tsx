
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditBloodRequestPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [patientName, setPatientName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("A+");
  const [units, setUnits] = useState("1");
  const [hospitalName, setHospitalName] = useState("");
  const [city, setCity] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API = "http://localhost:8080";

  useEffect(() => {
    async function loadRequest() {
      try {
        const response = await fetch(
          `${API}/api/blood-requests/${id}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        if (response.status === 403) {
          setError("You cannot edit someone else's request.");
          return;
        }

        if (!response.ok) {
          throw new Error("Blood request not found.");
        }

        const data = await response.json();

        setPatientName(data.patientName || "");
        setBloodGroup(data.bloodGroup || "A+");
        setUnits(String(data.units || 1));
        setHospitalName(data.hospitalName || "");
        setCity(data.city || "");
        setContactNumber(data.contactNumber || "");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load request."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadRequest();
    }
  }, [id, router]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const csrfResponse = await fetch(`${API}/api/csrf`, {
        credentials: "include",
        cache: "no-store",
      });

      if (!csrfResponse.ok) {
        throw new Error("Unable to get security token.");
      }

      const csrfData = await csrfResponse.json();

      const response = await fetch(
        `${API}/api/blood-requests/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            [csrfData.headerName]: csrfData.token,
          },
          body: JSON.stringify({
            patientName,
            bloodGroup,
            units: Number(units),
            hospitalName,
            city,
            contactNumber,
          }),
        }
      );

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (response.status === 403) {
        throw new Error("You cannot edit someone else's request.");
      }

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to update request.");
      }

      setSuccess("Blood request updated successfully!");

      setTimeout(() => {
        router.push("/requests");
      }, 1200);

    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <main className="page">Loading blood request...</main>;
  }

  return (
    <main className="page">
      <div className="container">
        <h1>❤️ Edit Blood Request</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        {!error && (
          <form onSubmit={handleSubmit}>
            <label>Patient Name</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
            />

            <label>Blood Group</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              required
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>

            <label>Units Required</label>
            <input
              type="number"
              min="1"
              max="20"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              required
            />

            <label>Hospital Name</label>
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              required
            />

            <label>City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />

            <label>Contact Number</label>
            <input
              type="tel"
              pattern="[0-9]{10}"
              maxLength={10}
              minLength={10}
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />

            <button type="submit" disabled={saving}>
              {saving ? "Updating..." : "Update Request"}
            </button>
          </form>
        )}

        <a className="back" href="/requests">
          ← Back to Blood Requests
        </a>
      </div>

      <style jsx>{`
        .page {
          font-family: Arial, sans-serif;
          background: #fff5f5;
          min-height: 100vh;
          margin: 0;
          padding: 30px 15px;
          color: black;
        }

        .container {
          max-width: 500px;
          margin: auto;
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 3px 12px #00000020;
        }

        h1 {
          text-align: center;
          color: #c62828;
        }

        label {
          display: block;
          margin-top: 15px;
          font-weight: bold;
        }

        input,
        select {
          width: 100%;
          padding: 11px;
          margin-top: 7px;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-sizing: border-box;
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
      `}</style>
    </main>
  );
}
