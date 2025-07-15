import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({ date: '', log_entry: '' });

  useEffect(() => {
    axios.get('/api/logs').then((res) => setLogs(res.data));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/logs', form);
      setLogs([res.data, ...logs]);
      setForm({ date: '', log_entry: '' });
    } catch (err) {
      alert('Invalid entry');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Hiking Logbook</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full border p-2"
        />
        <textarea
          name="log_entry"
          value={form.log_entry}
          onChange={handleChange}
          placeholder="Describe your hike..."
          required
          maxLength="1000"
          className="w-full border p-2 h-32"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Log
        </button>
      </form>

      <ul>
        {logs.map((log) => (
          <li key={log.id} className="border-b py-2">
            <strong>{log.date}:</strong> {log.log_entry}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
