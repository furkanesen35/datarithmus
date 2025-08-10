// packages/client/app/components/DashboardComponents/Resources.tsx
'use client';
import { useEffect, useState } from 'react';

interface Resource {
  id: number;
  title: string;
  category: string;
  fileName?: string;
  filePath?: string;
  link?: string;
  createdAt: string;
}

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResources() {
      try {
        const res = await fetch('/api/resources');
        if (!res.ok) throw new Error('Failed to fetch resources');
        setResources(await res.json());
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Failed to fetch resources');
        } else {
          setError('Failed to fetch resources');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchResources();
  }, []);

  if (loading) return <div>Loading resources...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Resources</h2>
      {resources.length === 0 ? (
        <div>No resources available yet.</div>
      ) : (
        <ul className="space-y-4">
          {resources.map((r) => (
            <li key={r.id} className="p-4 rounded shadow bg-white">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg">{r.title}</span>
                <span className="text-xs text-gray-500">{r.category}</span>
              </div>
              {r.fileName && r.filePath && (
                <a
                  href={r.filePath}
                  className="text-blue-500 hover:underline"
                  download
                >
                  Download: {r.fileName}
                </a>
              )}
              {r.link && (
                <a
                  href={r.link}
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Resource
                </a>
              )}
              <div className="text-xs text-gray-400">
                Added: {new Date(r.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
