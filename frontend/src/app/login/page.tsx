
"use client";

import { useState, useEffect, type FormEvent } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.has("error")) {
      setMessage("Invalid username or password.");
      setMessageType("error");
    } else if (params.has("logout")) {
      setMessage("You have logged out successfully.");
      setMessageType("success");
    }
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const username = String(formData.get("username"));
    const password = String(formData.get("password"));

    try {
      const csrfResponse = await fetch(
        "http://localhost:8080/api/csrf",
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!csrfResponse.ok) {
        throw new Error("Unable to connect to Java security service.");
      }

      const csrfData = await csrfResponse.json();

      const loginData = new URLSearchParams();
      loginData.append("username", username);
      loginData.append("password", password);

      const response = await fetch(
        "http://localhost:8080/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            [csrfData.headerName]: csrfData.token,
          },
          body: loginData.toString(),
          redirect: "follow",
        }
      );

      if (
        response.redirected &&
        new URL(response.url).searchParams.has("error")
      ) {
        setMessage("Invalid username or password.");
        setMessageType("error");
        return;
      }

      if (!response.ok || !response.redirected) {
        throw new Error("Login failed. Please check your Java backend.");
      }

      window.location.href = "/dashboard";

    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
      setMessageType("error");
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
          background: #fff0f0;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .login-box {
          width: 90%;
          max-width: 400px;
          background: white;
          padding: 35px;
          border-radius: 12px;
          box-shadow: 0 4px 15px #ddd;
        }

        h1 {
          text-align: center;
          color: #c62828;
        }

        p {
          text-align: center;
          color: #666;
        }

        label {
          display: block;
          margin-top: 18px;
          font-weight: bold;
        }

        input {
          width: 100%;
          padding: 12px;
          margin-top: 7px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 15px;
        }

        .password-container {
          position: relative;
        }

        .password-container input {
          padding-right: 65px;
        }

        .toggle-password {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #c62828;
          cursor: pointer;
          font-size: 13px;
          font-weight: bold;
          padding: 5px;
          margin: 0;
          width: auto;
        }

        .login-button {
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

        .login-button:hover {
          background: #a51f1f;
        }

        .login-button:disabled {
          opacity: 0.6;
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

        .signup {
          margin-top: 20px;
          text-align: center;
        }

        a {
          color: #c62828;
        }
      `}</style>

      <div className="page">
        <div className="login-box">
          <h1>🩸 BloodHelp</h1>
          <p>Login to your account</p>

          {message && (
            <p className={messageType}>
              {message}
            </p>
          )}

          <form onSubmit={handleLogin}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              autoComplete="username"
              required
            />

            <label>Password</label>

            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="signup">
            Don't have an account?{" "}
            <a href="/signup">Create Account</a>
          </div>
        </div>
      </div>
    </>
  );
}
