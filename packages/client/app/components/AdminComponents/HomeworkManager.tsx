"use client";
import { useState } from "react";

interface Homework {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  fileName?: string;
  createdAt: string;
}

interface HomeworkManagerProps {
  onMessage: (msg: string) => void;
  onError: (err: string) => void;
}

export default function HomeworkManager({ onMessage, onError }: HomeworkManagerProps) {
  const [homeworkTitle, setHomeworkTitle] = useState("");
  const [homeworkDescription, setHomeworkDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [homeworkFile, setHomeworkFile] = useState<File | null>(null);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeworkTitle || !homeworkDescription || !dueDate) {
      onError("Title, description, and due date are required");
      return;
    }

    if (editingId) {
      // Edit existing homework
      setHomeworks(
        homeworks.map((hw) =>
          hw.id === editingId
            ? {
                ...hw,
                title: homeworkTitle,
                description: homeworkDescription,
                dueDate,
                fileName: homeworkFile ? homeworkFile.name : hw.fileName,
              }
            : hw
        )
      );
      onMessage("Homework updated successfully");
      setEditingId(null);
    } else {
      // Create new homework
      const newHomework: Homework = {
        id: Date.now(),
        title: homeworkTitle,
        description: homeworkDescription,
        dueDate,
        fileName: homeworkFile ? homeworkFile.name : undefined,
        createdAt: new Date().toISOString(),
      };
      setHomeworks([newHomework, ...homeworks]);
      onMessage("Homework created successfully");
    }

    setHomeworkTitle("");
    setHomeworkDescription("");
    setDueDate("");
    setHomeworkFile(null);
  };

  const handleEdit = (hw: Homework) => {
    setEditingId(hw.id);
    setHomeworkTitle(hw.title);
    setHomeworkDescription(hw.description);
    setDueDate(hw.dueDate);
    setHomeworkFile(null); // File reset on edit
  };

  const handleDelete = (id: number) => {
    setHomeworks(homeworks.filter((hw) => hw.id !== id));
    onMessage("Homework deleted successfully");
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {editingId ? "Edit Homework" : "Create Homework"}
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
          <label htmlFor="homeworkDescription" className="block text-sm font-medium">
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
            {editingId ? "Update Homework" : "Create Homework"}
          </button>
          {editingId && (
            <button
              type="button"
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={() => {
                setEditingId(null);
                setHomeworkTitle("");
                setHomeworkDescription("");
                setDueDate("");
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
        {homeworks.length === 0 ? (
          <p>No homework assigned yet.</p>
        ) : (
          <ul className="space-y-4">
            {homeworks.map((hw) => (
              <li key={hw.id} className="p-4 bg-white border border-gray-300 rounded-md">
                <h4 className="text-md font-medium">{hw.title}</h4>
                <p className="text-sm">{hw.description}</p>
                <p className="text-sm">Due: {new Date(hw.dueDate).toLocaleDateString()}</p>
                {hw.fileName && <p className="text-sm">File: {hw.fileName}</p>}
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