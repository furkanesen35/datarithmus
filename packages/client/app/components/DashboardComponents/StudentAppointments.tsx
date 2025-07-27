import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Appointment {
  id: string;
  date: string;
  time: string;
  adminEmail: string;
  status: string;
}

export default function StudentAppointments() {
  const { auth } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointments() {
      if (!auth.user?.email) return;
      const res = await fetch(
        `/api/appointment-request?studentEmail=${auth.user.email}`,
      );
      if (res.ok) {
        setAppointments(await res.json());
      }
      setLoading(false);
    }
    fetchAppointments();
  }, [auth.user?.email]);

  if (loading) return <div>Loading appointments...</div>;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold mb-2">Your Upcoming Appointments</h3>
      {appointments.length === 0 && <div>No appointments found.</div>}
      <ul className="list-disc pl-5">
        {appointments
          .filter((a) => a.status === 'approved')
          .map((a) => (
            <li key={a.id}>
              {a.date} {a.time} with {a.adminEmail}
            </li>
          ))}
      </ul>
    </div>
  );
}
