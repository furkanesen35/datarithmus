"use client";
import { useState } from "react";

interface Student {
  id: number;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

interface StudentManagerProps {
  onMessage: (msg: string) => void;
  onError: (err: string) => void;
}

export default function StudentManager({ onMessage, onError }: StudentManagerProps) {
  const [studentEmail, setStudentEmail] = useState("");
  const [studentName, setStudentName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail || !studentName) {
      onError("Email and name are required");
      return;
    }

    if (editingId) {
      // Edit existing student
      setStudents(
        students.map((stu) =>
          stu.id === editingId
            ? { ...stu, email: studentEmail, name: studentName, isActive }
            : stu
        )
      );
      onMessage("Student updated successfully");
      setEditingId(null);
    } else {
      // Create new student
      const newStudent: Student = {
        id: Date.now(),
        email: studentEmail,
        name: studentName,
        isActive,
        createdAt: new Date().toISOString(),
      };
      setStudents([newStudent, ...students]);
      onMessage("Student added successfully");
    }

    setStudentEmail("");
    setStudentName("");
    setIsActive(true);
  };

  const handleEdit = (stu: Student) => {
    setEditingId(stu.id);
    setStudentEmail(stu.email);
    setStudentName(stu.name);
    setIsActive(stu.isActive);
  };

  const handleDelete = (id: number) => {
    setStudents(students.filter((stu) => stu.id !== id));
    onMessage("Student deleted successfully");
  };

  const toggleStatus = (id: number) => {
    setStudents(
      students.map((stu) =>
        stu.id === id ? { ...stu, isActive: !stu.isActive } : stu
      )
    );
    onMessage("Student status toggled");
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {editingId ? "Edit Student" : "Add Student"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="studentEmail" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="studentEmail"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
          />
        </div>
        <div>
          <label htmlFor="studentName" className="block text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            id="studentName"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
          />
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="mr-2"
            />
            Active
          </label>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {editingId ? "Update Student" : "Add Student"}
          </button>
          {editingId && (
            <button
              type="button"
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={() => {
                setEditingId(null);
                setStudentEmail("");
                setStudentName("");
                setIsActive(true);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Students List */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Students</h3>
        {students.length === 0 ? (
          <p>No students added yet.</p>
        ) : (
          <ul className="space-y-4">
            {students.map((stu) => (
              <li key={stu.id} className="p-4 bg-white border border-gray-300 rounded-md">
                <h4 className="text-md font-medium">{stu.name}</h4>
                <p className="text-sm">Email: {stu.email}</p>
                <p className="text-sm">Status: {stu.isActive ? "Active" : "Inactive"}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Created: {new Date(stu.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(stu)}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(stu.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => toggleStatus(stu.id)}
                    className="text-gray-500 hover:underline text-sm"
                  >
                    {stu.isActive ? "Deactivate" : "Activate"}
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