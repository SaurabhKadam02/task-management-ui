import { useState } from "react";
import api from "../services/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    try {
      const res = await api.post("/api/user/login", { username, password });

      if (!res.data.success) {
        setError(res.data.message);
        return;
      }
      
      sessionStorage.setItem("token", res.data.data.token);
      sessionStorage.setItem("userId", res.data.data.userId);
      window.location = "/projects";
    } catch {
      setError("Server error");
    }
  };

  return (
    <>
    {/* navbar */}
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand fw-bold">
            Task Management
          </span>
        </div>
      </nav>

      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4 shadow" style={{ width: "350px" }}>
          <h4 className="text-center">Login</h4>

          {error && <div className="alert alert-danger">{error}</div>}

          <input
            className="form-control mb-2"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-primary w-100" onClick={login}>
            Login
          </button>

          <div className="text-center mt-3">
            <small>
              New user? <a href="/register">Register here</a>
            </small>
          </div>
        </div>
      </div>
    </>
  );
}
