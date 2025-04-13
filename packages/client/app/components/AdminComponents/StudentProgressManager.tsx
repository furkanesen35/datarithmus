"use client";
import { useState } from "react";

interface ProgressEntry {
  id: number;
  studentEmail: string;
  homeworkCompleted: number;
  quizScore: number;
  notes: string;
  updatedAt: string;
}

interface StudentProgressManagerProps {
  onMessage: (msg: string) => void;
  onError: (err: string) => void;
}

export default function StudentProgressManager({ onMessage, onError }: StudentProgressManagerProps) {
  const [studentEmail, setStudentEmail] = useState("");
  const [homeworkCompleted, setHomeworkCompleted] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [notes, setNotes] = useState("");
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail) {
      onError("Student email is required");
      return;
    }

    if (editingId) {
      // Edit existing entry
      setProgressEntries(
        progressEntries.map((entry) =>
          entry.id === editingId
            ? {
                ...entry,
                studentEmail,
                homeworkCompleted,
                quizScore,
                notes,
                updatedAt: new Date().toISOString(),
              }
            : entry
        )
      );
      onMessage("Progress updated successfully");
      setEditingId(null);
    } else {
      // Create new entry
      const newEntry: ProgressEntry = {
        id: Date.now(),
        studentEmail,
        homeworkCompleted,
        quizScore,
        notes,
        updatedAt: new Date().toISOString(),
      };
      setProgressEntries([newEntry, ...progressEntries]);
      onMessage("Progress added successfully");
    }

    setStudentEmail("");
    setHomeworkCompleted(0);
    setQuizScore(0);
    setNotes("");
  };

  const handleEdit = (entry: ProgressEntry) => {
    setEditingId(entry.id);
    setStudentEmail(entry.studentEmail);
    setHomeworkCompleted(entry.homeworkCompleted);
    setQuizScore(entry.quizScore);
    setNotes(entry.notes);
  };

  const handleDelete = (id: number) => {
    setProgressEntries(progressEntries.filter((entry) => entry.id !== id));
    onMessage("Progress entry deleted successfully");
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {editingId ? "Edit Progress" : "Add Progress"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="studentEmail" className="block text-sm font-medium">
            Student Email
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
          <label htmlFor="homeworkCompleted" className="block text-sm font-medium">
            Homework Completed
          </label>
          <input
            type="number"
            id="homeworkCompleted"
            value={homeworkCompleted}
            onChange={(e) => setHomeworkCompleted(Number(e.target.value))}
            min="0"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
          />
        </div>
        <div>
          <label htmlFor="quizScore" className="block text-sm font-medium">
            Quiz Score (%)
          </label>
          <input
            type="number"
            id="quizScore"
            value={quizScore}
            onChange={(e) => setQuizScore(Number(e.target.value))}
            min="0"
            max="100"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            rows={4}
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {editingId ? "Update Progress" : "Add Progress"}
          </button>
          {editingId && (
            <button
              type="button"
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={() => {
                setEditingId(null);
                setStudentEmail("");
                setHomeworkCompleted(0);
                setQuizScore(0);
                setNotes("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Progress List */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Student Progress</h3>
        {progressEntries.length === 0 ? (
          <p>No progress entries yet.</p>
        ) : (
          <ul className="space-y-4">
            {progressEntries.map((entry) => (
              <li key={entry.id} className="p-4 bg-white border border-gray-300 rounded-md">
                <h4 className="text-md font-medium">{entry.studentEmail}</h4>
                <p className="text-sm">Homework Completed: {entry.homeworkCompleted}</p>
                <p className="text-sm">Quiz Score: {entry.quizScore}%</p>
                {entry.notes && <p className="text-sm">Notes: {entry.notes}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Updated: {new Date(entry.updatedAt).toLocaleDateString()}
                </p>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
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