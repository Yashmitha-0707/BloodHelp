
"use client";

import { useState, Suspense, FormEvent } from "react";
import { useSearchParams } from "next/navigation";

function SignupForm() {
  const searchParams = useSearchParams();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess(false);
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "");

    try {
      const csrfResponse = await fetch(
        "http://localhost:8080/api/csrf",
        { credentials: "include" }
      );

      if (!csrfResponse.ok) {
        throw new Error("Unable to connect to the server.");
      }

      const csrfData = await csrfResponse.json();

      const response = await fetch(
        "http://localhost:8080/api/signup",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            [csrfData.headerName]: csrfData.token,
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create account.");
      }

      setSuccess(true);
      event.currentTarget.reset();

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
          font-family: Arial, sans-serif;
          background: #fff5f5;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
        }

        .container {
          background: white;
          width: 350px;
          max-width: 100%;
          padding: 35px;
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
          margin-top: 18px;
          font-weight: bold;
        }

        input {
          width: 100%;
          padding: 12px;
          margin-top: 8px;
          border: 1px solid #ccc;
          border-radius: 6px;
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
          background: #a51f1f;
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .error {
          color: red;
          text-align: center;
        }

        .success {
          color: green;
          text-align: center;
        }

        a {
          color: #c62828;
          text-decoration: none;
        }
      `}</style>

      <div className="page">
        <div className="container">
          <h1>❤️ BloodHelp</h1>

          <p>Create Your Account</p>

          {(error || searchParams.has("error")) && (
            <p className="error">
              {error || "Unable to create account. Please try again."}
            </p>
          )}

          {(success || searchParams.has("success")) && (
            <p className="success">
              Account created successfully!
            </p>
          )}

          <form onSubmit={handleSignup}>
            <label>Username</label>

            <input
              type="text"
              name="username"
              required
              minLength={3}
              maxLength={30}
              placeholder="Enter your username"
            />

            <label>Password</label>

            <input
              type="password"
              name="password"
              required
              minLength={8}
              placeholder="Enter your password"
            />

            <button type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p>
            Already have an account?{" "}
            <a href="/login">Login</a>
          </p>

          <p>
            <a href="/">Back to Home</a>
          </p>
        </div>
      </div>
    </>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SignupForm />
    </Suspense>
  );
}
