
"use client";

import { useState } from "react";

type Donor = {
  id: number;
  name: string;
  age: number;
  bloodGroup: string;
  city: string;
};

export default function SearchPage() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [city, setCity] = useState("");
  const [searched, setSearched] = useState(false);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSearched(true);
    setLoading(true);
    setError("");
    setDonors([]);

    try {
      const params = new URLSearchParams({
        bloodGroup,
        city: city.trim(),
      });

      const response = await fetch(
        `http://localhost:8080/api/donors/search?${params.toString()}`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to search donors. Please try again.");
      }

      const data: Donor[] = await response.json();
      setDonors(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
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
          font-family: Arial, sans-serif;
          background: #fff0f0;
          min-height: 100vh;
          padding: 25px;
        }

        .container {
          max-width: 650px;
          margin: 30px auto;
          background: white;
          padding: 25px;
          border-radius: 12px;
        }

        h1 {
          text-align: center;
          color: #c62828;
        }

        label {
          display: block;
          margin-top: 12px;
        }

        input, select, button {
          width: 100%;
          padding: 12px;
          margin-top: 12px;
        }

        button {
          background: #c62828;
          color: white;
          border: none;
          cursor: pointer;
          border-radius: 6px;
          font-size: 15px;
        }

        button:hover {
          background: #a51d1d;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        table {
          width: 100%;
          margin-top: 25px;
          border-collapse: collapse;
          background: white;
        }

        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: center;
        }

        th {
          background: #c62828;
          color: white;
        }

        .message {
          text-align: center;
          margin-top: 20px;
        }

        .error {
          color: #c62828;
        }

        a {
          color: #c62828;
          text-decoration: none;
        }

        @media (max-width: 500px) {
          .page {
            padding: 10px;
          }

          .container {
            padding: 15px;
          }

          th, td {
            padding: 7px 4px;
            font-size: 12px;
          }
        }
      `}</style>

      <div className="page">
        <div className="container">
          <h1>❤️ Find Blood Donors</h1>

          <form onSubmit={handleSearch}>
            <label>Select Required Blood Group</label>

            <select
              name="bloodGroup"
              value={bloodGroup}
              onChange={(event) => setBloodGroup(event.target.value)}
              required
            >
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

            <label>Enter City (Optional)</label>

            <input
              type="text"
              name="city"
              placeholder="Example: Vijayawada"
              value={city}
              onChange={(event) => setCity(event.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search Donors"}
            </button>
          </form>

          {searched && (
            <>
              <p className="message">
                Search results for {bloodGroup}
                {city.trim() && ` in ${city}`}
              </p>

              {loading ? (
                <p className="message">Loading donors...</p>
              ) : error ? (
                <p className="message error">{error}</p>
              ) : donors.length === 0 ? (
                <p className="message">
                  No donors found for this search.
                </p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Blood Group</th>
                      <th>City</th>
                    </tr>
                  </thead>

                  <tbody>
                    {donors.map((donor) => (
                      <tr key={donor.id}>
                        <td>{donor.name}</td>
                        <td>{donor.age}</td>
                        <td>{donor.bloodGroup}</td>
                        <td>{donor.city}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          <p className="message">
            <a href="/">Back to Home</a>
          </p>
        </div>
      </div>
    </>
  );
}
