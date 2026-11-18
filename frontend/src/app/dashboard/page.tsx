
"use client";

import { useEffect, useState } from "react";

type Donor = {
  id: number;
  name: string;
  age: number;
  bloodGroup: string;
  city: string;
};

type DashboardData = {
  username: string;
  myDonors: Donor[];
};

export default function UserDashboard() {
  const [username, setUsername] = useState("User");
  const [myDonors, setMyDonors] = useState<Donor[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch(
          "http://localhost:8080/api/dashboard",
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load dashboard.");
        }

        const data: DashboardData = await response.json();

        setUsername(data.username);
        setMyDonors(data.myDonors || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  async function handleLogout() {
    try {
      const csrfResponse = await fetch(
        "http://localhost:8080/api/csrf",
        { credentials: "include" }
      );

      if (!csrfResponse.ok) {
        throw new Error("Unable to prepare logout.");
      }

      const csrfData = await csrfResponse.json();

      const response = await fetch(
        "http://localhost:8080/logout",
        {
          method: "POST",
          credentials: "include",
          headers: {
            [csrfData.headerName]: csrfData.token,
          },
        }
      );

      if (response.ok || response.redirected) {
        window.location.href = "/login";
      } else {
        setError("Logout failed. Please try again.");
      }
    } catch {
      setError("Unable to logout. Please try again.");
    }
  }

  return (
    <main className="dashboard-page">
      <header>
        <h1>❤️ BloodHelp</h1>
        <p>My User Dashboard</p>
      </header>

      <div className="container">

        <div className="card">
          <h2>Welcome, {username}!</h2>
          <p>Manage your BloodHelp account here.</p>
        </div>

        <div className="card">
          <h2>My Activities</h2>

          <div className="links">
            <a href="/register">Become a Donor</a>
            <a href="/search">Search Donors</a>
            <a href="/blood-request">Request Blood</a>
            <a href="/notifications">My Notifications</a>
            <a href="/">Home</a>

            <button
              type="button"
              className="logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="card">
          <h2>My Donor Details</h2>

          {loading && <p>Loading your details...</p>}

          {error && <p className="not-registered">{error}</p>}

          {!loading && !error && myDonors.length === 0 && (
            <p className="not-registered">
              You haven't registered as a donor yet.
            </p>
          )}

          {!loading && myDonors.length > 0 && (
            <p className="status">
              You are registered as a blood donor!
            </p>
          )}

          {myDonors.map((donor) => (
            <div className="donor-details" key={donor.id}>
              <p>
                <strong>Name:</strong> {donor.name}
              </p>

              <p>
                <strong>Age:</strong> {donor.age}
              </p>

              <p>
                <strong>Blood Group:</strong> {donor.bloodGroup}
              </p>

              <p>
                <strong>City:</strong> {donor.city}
              </p>

              <a
                className="edit-btn"
                href={`/donors/edit/${donor.id}`}
              >
                Edit My Details
              </a>
            </div>
          ))}
        </div>

      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .dashboard-page {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #fff5f5;
          min-height: 100vh;
          color: black;
        }

        header {
          background: #c62828;
          color: white;
          padding: 20px;
          text-align: center;
        }

        .container {
          max-width: 850px;
          margin: 30px auto;
          padding: 20px;
        }

        .card {
          background: white;
          padding: 22px;
          margin-bottom: 20px;
          border-radius: 10px;
          box-shadow: 0 3px 10px #ddd;
        }

        h2 {
          color: #c62828;
        }

        .links a,
        .links button {
          display: inline-block;
          background: #c62828;
          color: white;
          padding: 11px 16px;
          margin: 6px;
          text-decoration: none;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-size: 14px;
        }

        .edit-btn {
          display: inline-block;
          background: #c62828;
          color: white;
          padding: 10px 18px;
          text-decoration: none;
          border-radius: 6px;
          margin-top: 12px;
        }

        .logout {
          background: #333 !important;
        }

        .donor-details {
          border: 1px solid #eee;
          padding: 15px;
          margin-top: 12px;
          border-radius: 8px;
        }

        .status {
          color: green;
          font-weight: bold;
        }

        .not-registered {
          color: #c62828;
          font-weight: bold;
        }
      `}</style>
    </main>
  );
}
