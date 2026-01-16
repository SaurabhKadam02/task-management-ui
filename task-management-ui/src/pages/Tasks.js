import { useParams ,useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Tasks() {
  const { projectId } = useParams();
    const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const loadTasks = async () => {
    const res = await api.get(`/api/tasks/${projectId}`);
    setTasks(res.data.data || []);
  };

  const addTask = async () => {
    await api.post(`/api/tasks/${projectId}`, { title });
    setTitle("");
    loadTasks();
  };

  const updateStatus = async (id, status) => {
    await api.put(`/api/tasks/${id}?status=${status}`);
    loadTasks();
  };

  const deleteTask = async (id) => {
    await api.delete(`/api/tasks/${id}`);
    loadTasks();
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
     <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <span className="navbar-brand fw-bold">
          Task Management
        </span>

        <div className="ms-auto">
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => navigate("/projects")}
          >
            ← Back
          </button>
        </div>
      </nav>
    <div className="container mt-4">
      <h3>Tasks</h3>

      <div className="input-group mb-3">
        <input className="form-control"
          placeholder="Task title"
          value={title}
          onChange={e => setTitle(e.target.value)} />
        <button className="btn btn-success" onClick={addTask}>
          Add
        </button>
      </div>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th width="250">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(t => (
            <tr key={t.id}>
              <td>{t.title}</td>
              <td>{t.status}</td>
              <td>
                <button className="btn btn-sm btn-warning me-1"
                  onClick={() => updateStatus(t.id, "IN_PROGRESS")}>
                  In Progress
                </button>
                <button className="btn btn-sm btn-success me-1"
                  onClick={() => updateStatus(t.id, "DONE")}>
                  Done
                </button>
                <button className="btn btn-sm btn-danger"
                  onClick={() => deleteTask(t.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}
