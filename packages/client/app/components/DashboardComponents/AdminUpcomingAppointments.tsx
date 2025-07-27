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

export default function AdminUpcomingAppointments() {
  const { auth } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointments() {
      if (!auth.user?.email) return;
      const res = await fetch(
        `/api/appointment-request?adminEmail=${auth.user.email}`,
      );
      if (res.ok) setAppointments(await res.json());
      setLoading(false);
    }
    fetchAppointments();
  }, [auth.user?.email]);

  if (loading) return <div>Loading your upcoming appointments...</div>;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold mb-2">
        Your Upcoming Appointments (as Admin)
      </h3>
      {appointments.filter((a) => a.status === 'approved').length === 0 && (
        <div>No upcoming appointments.</div>
      )}
      <ul className="list-disc pl-5">
        {appointments
          .filter((a) => a.status === 'approved')
          .map((a) => (
            <li key={a.id}>
              {a.date} {a.time} with {a.studentEmail}
            </li>
          ))}
      </ul>
    </div>
  );
}
