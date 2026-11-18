
"use client";

export default function AdminDashboard() {
  const handleLogout = () => {
    alert("Logout will be connected to Java backend.");
  };

  return (
    <main className="admin-page">
      <header>
        <h1>❤️ BloodHelp Admin Dashboard</h1>
        <p>Manage your BloodHelp application</p>
      </header>

      <div className="container">
        <h2>Welcome, Admin!</h2>

        <div className="cards">
          <div className="card">
            <h2>👥 Total Donors</h2>
            <p className="count">0</p>
            <a href="/donors">View Donors</a>
          </div>

          <div className="card">
            <h2>🩸 Blood Requests</h2>
            <p className="count">0</p>
            <a href="/requests">View Requests</a>
          </div>
        </div>

        <button onClick={handleLogout}>Logout</button>

        <p>
          <a href="/" className="home-link">
            Back to Home
          </a>
        </p>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .admin-page {
          font-family: Arial, sans-serif;
          background: #fff5f5;
          min-height: 100vh;
          margin: 0;
          color: black;
        }

        header {
          background: #c62828;
          color: white;
          padding: 25px;
          text-align: center;
        }

        .container {
          max-width: 900px;
          margin: 40px auto;
          padding: 20px;
          text-align: center;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(220px, 1fr)
          );
          gap: 20px;
        }

        .card {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 3px 12px #00000015;
        }

        h2 {
          color: #c62828;
        }

        .count {
          font-size: 35px;
          font-weight: bold;
        }

        a {
          display: inline-block;
          background: #c62828;
          color: white;
          padding: 12px 20px;
          text-decoration: none;
          border-radius: 6px;
        }

        button {
          margin-top: 25px;
          padding: 12px 25px;
          background: #333;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .home-link {
          margin-top: 20px;
        }
      `}</style>
    </main>
  );
}
