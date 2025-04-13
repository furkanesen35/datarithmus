"use client";
import { useState } from "react";

interface Survey {
  id: number;
  question: string;
  scale: number;
  createdAt: string;
}

interface FeedbackManagerProps {
  onMessage: (msg: string) => void;
  onError: (err: string) => void;
}

export default function FeedbackManager({ onMessage, onError }: FeedbackManagerProps) {
  const [question, setQuestion] = useState("");
  const [scale, setScale] = useState(5);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) {
      onError("Question is required");
      return;
    }

    if (editingId) {
      // Edit existing survey
      setSurveys(
        surveys.map((sv) =>
          sv.id === editingId ? { ...sv, question, scale } : sv
        )
      );
      onMessage("Survey updated successfully");
      setEditingId(null);
    } else {
      // Create new survey
      const newSurvey: Survey = {
        id: Date.now(),
        question,
        scale,
        createdAt: new Date().toISOString(),
      };
      setSurveys([newSurvey, ...surveys]);
      onMessage("Survey created successfully");
    }

    setQuestion("");
    setScale(5);
  };

  const handleEdit = (sv: Survey) => {
    setEditingId(sv.id);
    setQuestion(sv.question);
    setScale(sv.scale);
  };

  const handleDelete = (id: number) => {
    setSurveys(surveys.filter((sv) => sv.id !== id));
    onMessage("Survey deleted successfully");
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {editingId ? "Edit Survey" : "Create Survey"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="question" className="block text-sm font-medium">
            Survey Question
          </label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
          />
        </div>
        <div>
          <label htmlFor="scale" className="block text-sm font-medium">
            Rating Scale (Max)
          </label>
          <select
            id="scale"
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
          >
            <option value={5}>1-5</option>
            <option value={10}>1-10</option>
          </select>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {editingId ? "Update Survey" : "Create Survey"}
          </button>
          {editingId && (
            <button
              type="button"
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={() => {
                setEditingId(null);
                setQuestion("");
                setScale(5);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Surveys List */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Feedback Surveys</h3>
        {surveys.length === 0 ? (
          <p>No surveys created yet.</p>
        ) : (
          <ul className="space-y-4">
            {surveys.map((sv) => (
              <li key={sv.id} className="p-4 bg-white border border-gray-300 rounded-md">
                <h4 className="text-md font-medium">{sv.question}</h4>
                <p className="text-sm">Scale: 1-{sv.scale}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Created: {new Date(sv.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(sv)}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(sv.id)}
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