// packages/client/app/components/AdminComponents/StudentManager.tsx
'use client';
import { useEffect, useState } from 'react';

interface Student {
  id: number;
  email: string;
  username: string;
  isActive: boolean;
  createdAt: string;
}

interface StudentManagerProps {
  onMessage: (msg: string) => void;
  onError: (err: string) => void;
}

export default function StudentManager({
  onMessage,
  onError,
}: StudentManagerProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteUsername, setInviteUsername] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/students', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch students');
      setStudents(await res.json());
    } catch (err: any) {
      onError(err.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: number, isActive: boolean) => {
    setLoading(true);
    try {
      const res = await fetch('/api/students', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, isActive: !isActive }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      await fetchStudents();
      onMessage('Student status updated');
    } catch (err: any) {
      onError(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this student? This cannot be undone.',
      )
    )
      return;
    setLoading(true);
    try {
      const res = await fetch('/api/students', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete student');
      await fetchStudents();
      onMessage('Student deleted');
    } catch (err: any) {
      onError(err.message || 'Failed to delete student');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail || !inviteUsername)
      return onError('Email and username required');
    setInviteLoading(true);
    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: inviteEmail, username: inviteUsername }),
      });
      const data = await res.json();
      if (res.ok) {
        onMessage('Invitation sent!');
        setInviteEmail('');
        setInviteUsername('');
        await fetchStudents();
      } else {
        onError(data.error || 'Failed to invite user');
      }
    } catch (err: any) {
      onError(err.message || 'Failed to invite user');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleAdminPasswordReset = async (email: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        onMessage('Password reset email sent.');
      } else {
        onError(data.error || 'Failed to send password reset email.');
      }
    } catch (err: any) {
      onError(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter(
    (stu) =>
      stu.email.toLowerCase().includes(search.toLowerCase()) ||
      (stu.username || '').toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Manage Students</h2>
      <div className="mb-4 flex gap-2 items-end">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Verified</th>
              <th className="border px-2 py-1">Registered</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No students found.
                </td>
              </tr>
            ) : (
              filtered.map((stu) => (
                <tr key={stu.id}>
                  <td className="border px-2 py-1">{stu.username}</td>
                  <td className="border px-2 py-1">{stu.email}</td>
                  <td className="border px-2 py-1">
                    {stu.isActive ? 'Active' : 'Inactive'}
                  </td>
                  <td className="border px-2 py-1">
                    {stu.isActive ? (
                      '✔'
                    ) : (
                      <span className="text-red-500">✖</span>
                    )}
                  </td>
                  <td className="border px-2 py-1">
                    {new Date(stu.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border px-2 py-1 space-x-2">
                    <button
                      onClick={() => handleToggleStatus(stu.id, stu.isActive)}
                      className="text-gray-500 hover:underline text-sm"
                    >
                      {stu.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(stu.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleAdminPasswordReset(stu.email)}
                      className="text-blue-500 hover:underline text-sm mr-2"
                    >
                      Send Password Reset
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Move the invite form below the table */}
      <div className="mt-8 p-4 bg-gray-100 rounded-md max-w-[full] mx-auto">
        <h3 className="font-semibold mb-2 text-lg">Invite New User</h3>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Invite email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-black"
          />
          <input
            type="text"
            placeholder="Invite username"
            value={inviteUsername}
            onChange={(e) => setInviteUsername(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-black"
          />
          <button
            onClick={handleInvite}
            disabled={inviteLoading}
            className="bg-blue-500 text-white rounded px-2 py-1 mt-1 hover:bg-blue-600 disabled:opacity-50"
          >
            {inviteLoading ? 'Inviting...' : 'Invite User'}
          </button>
        </div>
      </div>
    </div>
  );
}
