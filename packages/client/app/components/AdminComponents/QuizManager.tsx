// packages/client/app/components/AdminComponents/QuizManager.tsx
'use client';
import { useState, useEffect } from 'react';

interface Quiz {
  id: number;
  title: string;
  questions: QuizQuestion[];
  createdAt: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // 1-based index
}

export default function QuizManager() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  // Remove unused activeTab state
  // const [activeTab, setActiveTab] = useState(0);

  // For new question input
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState<string[]>(['']);
  const [newCorrectAnswer, setNewCorrectAnswer] = useState(1); // 1-based

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    const res = await fetch('/api/quizzes', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setQuizzes(data);
    }
    setLoading(false);
  };

  const handleAddOption = () => {
    setNewOptions([...newOptions, '']);
  };

  const handleRemoveOption = (idx: number) => {
    if (newOptions.length === 1) return;
    const updated = newOptions.filter((_, i) => i !== idx);
    setNewOptions(updated);
    // Adjust correct answer if needed
    if (newCorrectAnswer > updated.length) {
      setNewCorrectAnswer(updated.length);
    }
  };

  const handleAddQuestion = () => {
    if (!newQuestion || newOptions.some((opt) => !opt) || !newCorrectAnswer)
      return;
    setQuestions([
      ...questions,
      {
        question: newQuestion,
        options: [...newOptions],
        correctAnswer: newCorrectAnswer, // 1-based
      },
    ]);
    setNewQuestion('');
    setNewOptions(['']);
    setNewCorrectAnswer(1);
    // setActiveTab(questions.length + 1);
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
    // setActiveTab(0);
  };

  const handleSaveQuiz = async () => {
    if (!quizTitle.trim() || questions.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        body: JSON.stringify({
          title: quizTitle,
          questions: questions.map((q) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
          })),
        }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to save quiz');
        setLoading(false);
        return;
      }
      setQuestions([]);
      setQuizTitle('');
      // setActiveTab(0);
      fetchQuizzes();
    } catch {
      alert('Network or server error');
    }
    setLoading(false);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Create Quiz</h2>
      <div className="mb-4">
        <label htmlFor="quiz-title" className="block text-sm font-medium mb-1">
          Quiz Title
        </label>
        <input
          id="quiz-title"
          type="text"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          className="mb-2 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
          placeholder="Enter quiz title..."
        />
        <button
          className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={handleAddQuestion}
        >
          Add a new Question to Quiz
        </button>
      </div>
      <div className="mb-4">
        {questions.map((q, idx) => (
          <div
            key={idx}
            className="border p-4 mb-2 rounded-md bg-gray-50 relative"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold">Question {idx + 1}</span>
              <button
                type="button"
                className="text-red-600 hover:underline text-xs font-bold px-2 py-1 border border-red-200 rounded absolute top-2 right-2 bg-white shadow"
                onClick={() => handleRemoveQuestion(idx)}
                aria-label={`Remove Question ${idx + 1}`}
              >
                ✕ Remove Question
              </button>
            </div>
            <div className="mt-2">
              <div className="mb-2">{q.question}</div>
              <ul className="list-decimal ml-6">
                {q.options.map((opt, i) => (
                  <li
                    key={i}
                    className={
                      q.correctAnswer === i + 1
                        ? 'font-bold text-green-600'
                        : ''
                    }
                  >
                    {opt}
                  </li>
                ))}
              </ul>
              <div className="text-xs text-gray-500 mt-1">
                Correct Answer: Option {q.correctAnswer}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border p-4 rounded-md bg-white mb-4">
        <div className="font-semibold mb-2">Add New Question</div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddQuestion();
          }}
          className="space-y-2"
        >
          <div>
            <label htmlFor="new-question" className="block text-sm font-medium">
              Question
            </label>
            <input
              id="new-question"
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            />
          </div>
          {newOptions.map((opt, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="flex-1">
                <label
                  htmlFor={`new-option-${i}`}
                  className="block text-sm font-medium"
                >
                  Option {i + 1}
                </label>
                <input
                  id={`new-option-${i}`}
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const opts = [...newOptions];
                    opts[i] = e.target.value;
                    setNewOptions(opts);
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                />
              </div>
              <button
                type="button"
                className="text-red-500 hover:underline text-xs mt-6"
                onClick={() => handleRemoveOption(i)}
                disabled={newOptions.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="py-1 px-2 bg-gray-200 text-black rounded hover:bg-gray-300 text-xs"
            onClick={handleAddOption}
          >
            Add Option
          </button>
          <div>
            <label
              htmlFor="new-correct-answer"
              className="block text-sm font-medium"
            >
              Correct Answer (1-{newOptions.length})
            </label>
            <input
              id="new-correct-answer"
              type="number"
              min="1"
              max={newOptions.length}
              value={newCorrectAnswer}
              onChange={(e) => setNewCorrectAnswer(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            />
          </div>
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save this Question
          </button>
        </form>
      </div>
      <button
        className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        onClick={handleSaveQuiz}
        disabled={questions.length === 0 || loading}
      >
        Save Quiz
      </button>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">All Quizzes</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="p-4 bg-white border border-gray-300 rounded-md mb-4"
            >
              <h4 className="text-md font-medium mb-2">{quiz.title}</h4>
              {quiz.questions && quiz.questions.length > 0 ? (
                quiz.questions.map((q: QuizQuestion, idx: number) => {
                  // If q.options is a string, parse it; otherwise, use as is
                  const options: string[] = Array.isArray(q.options)
                    ? q.options
                    : JSON.parse(q.options);
                  return (
                    <div
                      key={idx}
                      className="mb-2 p-2 border rounded bg-gray-50"
                    >
                      <div className="font-semibold">
                        Question {idx + 1}: {q.question}
                      </div>
                      <ul className="list-decimal ml-6">
                        {options.map((opt: string, i: number) => (
                          <li
                            key={i}
                            className={
                              q.correctAnswer === i
                                ? 'font-bold text-green-600'
                                : ''
                            }
                          >
                            {opt}
                          </li>
                        ))}
                      </ul>
                      <div className="text-xs text-gray-500 mt-1">
                        Correct Answer: Option {q.correctAnswer + 1}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">
                  No questions in this quiz.
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
