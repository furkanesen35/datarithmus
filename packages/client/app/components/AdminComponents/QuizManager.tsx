"use client";
import { useState } from "react";

interface Quiz {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  createdAt: string;
}

interface QuizManagerProps {
  onMessage: (msg: string) => void;
  onError: (err: string) => void;
}

export default function QuizManager({ onMessage, onError }: QuizManagerProps) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || options.some((opt) => !opt)) {
      onError("Question and all options are required");
      return;
    }

    if (editingId) {
      // Edit existing quiz
      setQuizzes(
        quizzes.map((qz) =>
          qz.id === editingId
            ? { ...qz, question, options: [...options], correctAnswer }
            : qz
        )
      );
      onMessage("Quiz updated successfully");
      setEditingId(null);
    } else {
      // Create new quiz
      const newQuiz: Quiz = {
        id: Date.now(),
        question,
        options: [...options],
        correctAnswer,
        createdAt: new Date().toISOString(),
      };
      setQuizzes([newQuiz, ...quizzes]);
      onMessage("Quiz created successfully");
    }

    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
  };

  const handleEdit = (qz: Quiz) => {
    setEditingId(qz.id);
    setQuestion(qz.question);
    setOptions([...qz.options]);
    setCorrectAnswer(qz.correctAnswer);
  };

  const handleDelete = (id: number) => {
    setQuizzes(quizzes.filter((qz) => qz.id !== id));
    onMessage("Quiz deleted successfully");
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {editingId ? "Edit Quiz" : "Create Quiz"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="question" className="block text-sm font-medium">
            Question
          </label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
          />
        </div>
        {options.map((opt, index) => (
          <div key={index}>
            <label htmlFor={`option${index}`} className="block text-sm font-medium">
              Option {index + 1}
            </label>
            <input
              type="text"
              id={`option${index}`}
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            />
          </div>
        ))}
        <div>
          <label htmlFor="correctAnswer" className="block text-sm font-medium">
            Correct Answer
          </label>
          <select
            id="correctAnswer"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
          >
            {options.map((_, index) => (
              <option key={index} value={index}>
                Option {index + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {editingId ? "Update Quiz" : "Create Quiz"}
          </button>
          {editingId && (
            <button
              type="button"
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={() => {
                setEditingId(null);
                setQuestion("");
                setOptions(["", "", "", ""]);
                setCorrectAnswer(0);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Quizzes List */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Quizzes</h3>
        {quizzes.length === 0 ? (
          <p>No quizzes created yet.</p>
        ) : (
          <ul className="space-y-4">
            {quizzes.map((qz) => (
              <li key={qz.id} className="p-4 bg-white border border-gray-300 rounded-md">
                <h4 className="text-md font-medium">{qz.question}</h4>
                <ul className="text-sm list-disc pl-5">
                  {qz.options.map((opt, idx) => (
                    <li key={idx} className={idx === qz.correctAnswer ? "text-green-600" : ""}>
                      {opt} {idx === qz.correctAnswer ? "(Correct)" : ""}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 mt-1">
                  Created: {new Date(qz.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(qz)}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(qz.id)}
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