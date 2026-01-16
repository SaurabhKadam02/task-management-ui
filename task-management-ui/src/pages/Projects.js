import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const userId = sessionStorage.getItem("userId");

  const loadProjects = async () => {
    const res = await api.get(`/api/projects/${userId}`);
    setProjects(res.data.data || []);
  };

  const createProject = async () => {
    try {
      const res = await api.post(`/api/projects/${userId}`, {
        name,
        description,
        duration: duration ? Number(duration) : 0,
      });

      setMessage(res.data.message || "Operation completed");
      setIsError(res.data.success === false);

      if (res.data.success) {
        setName("");
        setDescription("");
        setDuration("");
        loadProjects();
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create project");
      setIsError(true);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);
  const logout = () => {
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <>
      {" "}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <span className="navbar-brand fw-bold">Task Management</span>
        <div className="ms-auto">
          <button className="btn btn-outline-light btn-sm" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>
      <div className="container mt-4">
        <h3 className="text-center mb-4">Projects</h3>

        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card p-4 mb-4 shadow-sm">
              {message && (
                <div
                  className={`alert ${
                    isError ? "alert-danger" : "alert-success"
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Project Name</label>
                <input
                  className="form-control"
                  placeholder="Enter project name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Enter project description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Duration (days)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <button className="btn btn-success w-100" onClick={createProject}>
                Add Project
              </button>
            </div>
          </div>
        </div>

        {/* Project List */}
        <ul className="list-group">
          {projects.map((p) => (
            <li
              key={p.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <h6 className="mb-1">{p.name}</h6>
                <small className="text-muted">
                  {p.description} | {p.duration} days
                </small>
              </div>

              <a className="btn btn-sm btn-primary" href={`/tasks/${p.id}`}>
                Tasks
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
