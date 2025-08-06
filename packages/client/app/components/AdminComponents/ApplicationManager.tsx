import { useEffect, useState } from 'react';

interface Application {
  id: number;
  name: string;
  email: string;
  course: string;
  message?: string;
  status: string;
  createdAt: string;
}

interface ApplicationManagerProps {
  onMessage: (msg: string) => void;
  onError: (err: string) => void;
}

export default function ApplicationManager({ onMessage, onError }: ApplicationManagerProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/enroll');
      if (!res.ok) throw new Error('Failed to fetch applications');
      setApplications(await res.json());
    } catch (err: unknown) {
      if (err instanceof Error) {
        onError(err.message || 'Failed to fetch applications');
      } else {
        onError('Failed to fetch applications');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pending Applications</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Course</th>
              <th className="border px-2 py-1">Message</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">Loading...</td>
              </tr>
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">No applications found.</td>
              </tr>
            ) : (
              applications.map(app => (
                <tr key={app.id}>
                  <td className="border px-2 py-1">{app.name}</td>
                  <td className="border px-2 py-1">{app.email}</td>
                  <td className="border px-2 py-1">{app.course}</td>
                  <td className="border px-2 py-1">{app.message || '-'}</td>
                  <td className="border px-2 py-1">{app.status}
                    {app.status === 'pending' && (
                      <div className="flex gap-2 mt-2">
                        <button
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                          onClick={async () => {
                            setLoading(true);
                            try {
                              const res = await fetch('/api/admin/invite-from-application', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: app.id }),
                              });
                              const data = await res.json();
                              if (res.ok) {
                                onMessage('Invitation sent and application approved');
                                await fetchApplications();
                              } else {
                                onError(data.error || 'Failed to send invitation');
                              }
                            } catch {
                              onError('Failed to send invitation');
                            } finally {
                              setLoading(false);
                            }
                          }}
                          disabled={loading}
                        >Approve & Invite</button>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                          onClick={async () => {
                            setLoading(true);
                            try {
                              const res = await fetch('/api/enroll', {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: app.id, status: 'rejected' }),
                              });
                              if (res.ok) {
                                onMessage('Application rejected');
                                await fetchApplications();
                              } else {
                                onError('Failed to reject application');
                              }
                            } catch {
                              onError('Failed to reject application');
                            } finally {
                              setLoading(false);
                            }
                          }}
                          disabled={loading}
                        >Reject</button>
                      </div>
                    )}
                  </td>
                  <td className="border px-2 py-1">{new Date(app.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
