import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Admin {
  email: string;
  username: string;
}

interface AppointmentRequestFormProps {
  onRequestSuccess?: () => void;
}

export default function AppointmentRequestForm({
  onRequestSuccess,
}: AppointmentRequestFormProps) {
  const { auth } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [adminEmail, setAdminEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAdmins() {
      const res = await fetch('/api/admins');
      if (res.ok) {
        const data = await res.json();
        // If the API returns { admins: [...] }, use data.admins
        setAdmins(Array.isArray(data.admins) ? data.admins : []);
      } else {
        setAdmins([]);
      }
    }
    fetchAdmins();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const res = await fetch('/api/appointment-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentEmail: auth.user?.email,
        adminEmail,
        date,
        time,
        message,
      }),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess('Appointment request sent! Await admin approval.');
      setAdminEmail('');
      setDate('');
      setTime('');
      setMessage('');
      onRequestSuccess?.();
    } else {
      setError('Failed to send request.');
    }
  };

  return (
    <form className="bg-white p-4 rounded shadow mb-6" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold mb-2">Request Appointment</h2>
      {success && <div className="text-green-600 mb-2">{success}</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <label className="block mb-2">
        Select Admin:
        <select
          className="w-full border rounded p-1 mt-1"
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
          required
        >
          <option value="">Choose an admin</option>
          {admins.map((admin) => (
            <option key={admin.email} value={admin.email}>
              {admin.username} ({admin.email})
            </option>
          ))}
        </select>
      </label>
      <label className="block mb-2">
        Date:
        <input
          type="date"
          className="w-full border rounded p-1 mt-1"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>
      <label className="block mb-2">
        Time:
        <input
          type="time"
          className="w-full border rounded p-1 mt-1"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </label>
      <label className="block mb-2">
        Message (optional):
        <textarea
          className="w-full border rounded p-1 mt-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Request Appointment'}
      </button>
    </form>
  );
}
