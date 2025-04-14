"use client";
import { useState, useEffect } from "react";

interface Quiz {
  id: number;
  question: string;
  options: string;
  correctAnswer: number;
  createdAt: string;
}

export default function QuizManager() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    const res = await fetch("/api/quizzes", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (res.ok) {
      const data = await res.json();
      setQuizzes(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || options.some((opt) => !opt) || !correctAnswer) return;

    const body = {
      question,
      options,
      correctAnswer,
      ...(editingId && { id: editingId }),
    };

    const res = await fetch("/api/quizzes", {
      method: editingId ? "PUT" : "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      fetchQuizzes();
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
      setEditingId(null);
    }
  };

  const handleEdit = (quiz: Quiz) => {
    setEditingId(quiz.id);
    setQuestion(quiz.question);
    setOptions(JSON.parse(quiz.options));
    setCorrectAnswer(quiz.correctAnswer.toString());
  };

  const handleDelete = async (id: number) => {
    const res = await fetch("/api/quizzes", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (res.ok) fetchQuizzes();
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Quiz" : "Create Quiz"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="question" className="block text-sm font-medium">Question</label>
          <input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
          />
        </div>
        {options.map((opt, i) => (
          <div key={i}>
            <label htmlFor={`option-${i}`} className="block text-sm font-medium">Option {i + 1}</label>
            <input
              id={`option-${i}`}
              type="text"
              value={opt}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[i] = e.target.value;
                setOptions(newOptions);
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            />
          </div>
        ))}
        <div>
          <label htmlFor="correctAnswer" className="block text-sm font-medium">Correct Answer (0-3)</label>
          <input
            id="correctAnswer"
            type="number"
            min="0"
            max="3"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
          />
        </div>
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {editingId ? "Update Quiz" : "Create Quiz"}
        </button>
      </form>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Quizzes</h3>
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="p-4 bg-white border border-gray-300 rounded-md mb-2">
            <h4 className="text-md font-medium">{quiz.question}</h4>
            <p className="text-sm">Options: {JSON.parse(quiz.options).join(", ")}</p>
            <p className="text-sm">Correct: {quiz.correctAnswer}</p>
            <div className="mt-2 flex space-x-2">
              <button onClick={() => handleEdit(quiz)} className="text-blue-500 hover:underline">
                Edit
              </button>
              <button onClick={() => handleDelete(quiz.id)} className="text-red-500 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}