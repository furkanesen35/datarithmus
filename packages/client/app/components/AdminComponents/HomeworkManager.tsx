// packages/client/app/components/AdminComponents/HomeworkManager.tsx
'use client';
import { useState, useEffect } from 'react';

interface Homework {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  fileName?: string;
  filePath?: string;
  createdAt: string;
}

interface HomeworkManagerProps {
  onMessage: (msg: string) => void;
  onError: (err: string) => void;
}

export default function HomeworkManager({
  onMessage,
  onError,
}: HomeworkManagerProps) {
  const [homeworkTitle, setHomeworkTitle] = useState('');
  const [homeworkDescription, setHomeworkDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [homeworkFile, setHomeworkFile] = useState<File | null>(null);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHomeworks();
  }, []);

  const fetchHomeworks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/homework', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch homework');
      setHomeworks(await res.json());
    } catch (err: any) {
      onError(err.message || 'Failed to fetch homework');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeworkTitle || !homeworkDescription || !dueDate) {
      onError('Title, description, and due date are required');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', homeworkTitle);
      formData.append('description', homeworkDescription);
      formData.append('dueDate', dueDate);
      if (homeworkFile) formData.append('file', homeworkFile);
      if (editingId) formData.append('id', editingId.toString());
      const res = await fetch('/api/homework', {
        method: editingId ? 'PUT' : 'POST',
        body: formData,
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to save homework');
      await fetchHomeworks();
      onMessage(
        editingId
          ? 'Homework updated successfully'
          : 'Homework created successfully',
      );
      setEditingId(null);
      setHomeworkTitle('');
      setHomeworkDescription('');
      setDueDate('');
      setHomeworkFile(null);
    } catch (err: any) {
      onError(err.message || 'Failed to save homework');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hw: Homework) => {
    setEditingId(hw.id);
    setHomeworkTitle(hw.title);
    setHomeworkDescription(hw.description);
    setDueDate(hw.dueDate);
    setHomeworkFile(null); // File reset on edit
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch('/api/homework', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete homework');
      await fetchHomeworks();
      onMessage('Homework deleted successfully');
    } catch (err: any) {
      onError(err.message || 'Failed to delete homework');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {editingId ? 'Edit Homework' : 'Create Homework'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="homeworkTitle" className="block text-sm font-medium">
            Homework Title
          </label>
          <input
            type="text"
            id="homeworkTitle"
            value={homeworkTitle}
            onChange={(e) => setHomeworkTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
          />
        </div>
        <div>
          <label
            htmlFor="homeworkDescription"
            className="block text-sm font-medium"
          >
            Description
          </label>
          <textarea
            id="homeworkDescription"
            value={homeworkDescription}
            onChange={(e) => setHomeworkDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            rows={4}
          />
        </div>
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
          />
        </div>
        <div>
          <label htmlFor="homeworkFile" className="block text-sm font-medium">
            File (Optional)
          </label>
          <input
            type="file"
            id="homeworkFile"
            accept=".pdf,.doc,.docx,.zip"
            onChange={(e) => setHomeworkFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {editingId ? 'Update Homework' : 'Create Homework'}
          </button>
          {editingId && (
            <button
              type="button"
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={() => {
                setEditingId(null);
                setHomeworkTitle('');
                setHomeworkDescription('');
                setDueDate('');
                setHomeworkFile(null);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Homework List */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Homework Assignments</h3>
        {loading ? (
          <p>Loading...</p>
        ) : homeworks.length === 0 ? (
          <p>No homework assigned yet.</p>
        ) : (
          <ul className="space-y-4">
            {homeworks.map((hw) => (
              <li
                key={hw.id}
                className="p-4 bg-white border border-gray-300 rounded-md"
              >
                <h4 className="text-md font-medium">{hw.title}</h4>
                <p className="text-sm">{hw.description}</p>
                <p className="text-sm">
                  Due: {new Date(hw.dueDate).toLocaleDateString()}
                </p>
                {hw.filePath && (
                  <p className="text-sm">
                    File:{' '}
                    <a
                      href={hw.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Download
                    </a>
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Created: {new Date(hw.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(hw)}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(hw.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
