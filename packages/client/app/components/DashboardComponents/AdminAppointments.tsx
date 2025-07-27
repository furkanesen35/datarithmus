import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Appointment {
  id: number;
  studentEmail: string;
  adminEmail: string;
  date: string;
  time: string;
  message?: string;
  status: string;
  createdAt: string;
}

export default function AdminAppointments() {
  const { auth } = useAuth();
  const [requests, setRequests] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequests() {
      if (!auth.user?.email) return;
      const res = await fetch(
        `/api/appointment-request?adminEmail=${auth.user.email}`,
      );
      if (res.ok) setRequests(await res.json());
      setLoading(false);
    }
    fetchRequests();
  }, [auth.user?.email]);

  async function handleAction(id: number, status: 'approved' | 'rejected') {
    await fetch(`/api/appointment-request/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setRequests((reqs) =>
      reqs.map((r) => (r.id === id ? { ...r, status } : r)),
    );
  }

  if (loading) return <div>Loading appointment requests...</div>;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold mb-2">Pending Appointment Requests</h3>
      {requests.filter((r) => r.status === 'pending').length === 0 && (
        <div>No pending requests.</div>
      )}
      <ul className="list-disc pl-5">
        {requests
          .filter((r) => r.status === 'pending')
          .map((r) => (
            <li key={r.id} className="mb-2">
              <div>
                <b>{r.studentEmail}</b> requested {r.date} {r.time}
                <br />
                Message: {r.message || '(none)'}
              </div>
              <button
                className="mr-2 px-2 py-1 bg-green-600 text-white rounded"
                onClick={() => handleAction(r.id, 'approved')}
              >
                Approve
              </button>
              <button
                className="px-2 py-1 bg-red-600 text-white rounded"
                onClick={() => handleAction(r.id, 'rejected')}
              >
                Reject
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
