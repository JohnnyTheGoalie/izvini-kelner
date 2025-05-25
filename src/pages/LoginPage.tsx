import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://46.240.186.243:8000/kelner/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "password",
          username,
          password,
        }),
      });

      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      localStorage.setItem("authToken", data.access_token);
      navigate("/home");
    } catch (err) {
      setError("Invalid credentials or network error.");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--color-background)]">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="block w-full mb-3 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full mb-3 p-2 border rounded"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-[var(--color-primary)] text-white py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
