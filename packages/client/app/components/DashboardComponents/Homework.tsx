// packages/client/app/components/DashboardComponents/Homework.tsx
'use client';
import { useEffect, useState } from 'react';

interface Homework {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  fileName?: string;
  filePath?: string;
  createdAt: string;
}

export default function Homework() {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHomeworks() {
      try {
        const res = await fetch('/api/homework');
        if (!res.ok) throw new Error('Failed to fetch homework');
        setHomeworks(await res.json());
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Failed to fetch homework');
        } else {
          setError('Failed to fetch homework');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchHomeworks();
  }, []);

  if (loading) return <div>Loading homework...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Homework</h2>
      {homeworks.length === 0 ? (
        <div>No homework assigned yet.</div>
      ) : (
        <ul className="space-y-4">
          {homeworks.map((hw) => (
            <li key={hw.id} className="p-4 rounded shadow bg-white">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg">{hw.title}</span>
                <span className="text-xs text-gray-500">Due: {new Date(hw.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="mb-2">{hw.description}</div>
              {hw.fileName && hw.filePath && (
                <a href={hw.filePath} className="text-blue-500 hover:underline" download>
                  Download: {hw.fileName}
                </a>
              )}
              <div className="text-xs text-gray-400">Assigned: {new Date(hw.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
