// packages/client/app/components/AdminComponents/StudentManager.tsx
"use client";
import { useEffect, useState } from "react";

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

export default function StudentManager({ onMessage, onError }: StudentManagerProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/students", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch students");
      setStudents(await res.json());
    } catch (err: any) {
      onError(err.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: number, isActive: boolean) => {
    setLoading(true);
    try {
      const res = await fetch("/api/students", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id, isActive: !isActive }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      await fetchStudents();
      onMessage("Student status updated");
    } catch (err: any) {
      onError(err.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this student? This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/students", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete student");
      await fetchStudents();
      onMessage("Student deleted");
    } catch (err: any) {
      onError(err.message || "Failed to delete student");
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter(
    (stu) =>
      stu.email.toLowerCase().includes(search.toLowerCase()) ||
      (stu.username || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Manage Students</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Registered</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-4">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-4">No students found.</td></tr>
            ) : (
              filtered.map((stu) => (
                <tr key={stu.id}>
                  <td className="border px-2 py-1">{stu.username}</td>
                  <td className="border px-2 py-1">{stu.email}</td>
                  <td className="border px-2 py-1">{stu.isActive ? "Active" : "Inactive"}</td>
                  <td className="border px-2 py-1">{new Date(stu.createdAt).toLocaleDateString()}</td>
                  <td className="border px-2 py-1 space-x-2">
                    <button
                      onClick={() => handleToggleStatus(stu.id, stu.isActive)}
                      className="text-gray-500 hover:underline text-sm"
                    >
                      {stu.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDelete(stu.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}