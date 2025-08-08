// packages/client/app/components/DashboardComponents/Announcements.tsx
'use client';
import { useEffect, useState } from 'react';

interface Announcement {
  id: number;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const res = await fetch('/api/announcements');
        if (!res.ok) throw new Error('Failed to fetch announcements');
        setAnnouncements(await res.json());
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Error fetching announcements');
        } else {
          setError('Error fetching announcements');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);

  if (loading) return <div>Loading announcements...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  // Sort: pinned first (latest pinned first), then unpinned (latest first)
  const sorted = [...announcements].sort((a, b) => {
    if (a.pinned && b.pinned) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (a.pinned) return -1;
    if (b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Announcements</h2>
      {sorted.length === 0 ? (
        <div>No announcements yet.</div>
      ) : (
        <ul className="space-y-4">
          {sorted.map((a) => (
            <li key={a.id} className={`p-4 rounded shadow ${a.pinned ? 'bg-yellow-100 border-l-4 border-yellow-500' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg">{a.title}</span>
                {a.pinned && <span className="text-yellow-600 font-bold">Pinned</span>}
              </div>
              <div className="mb-2">{a.content}</div>
              <div className="text-xs text-gray-500">{new Date(a.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
