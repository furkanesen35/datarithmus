// packages/client/app/components/DashboardComponents/Quizzes.tsx
'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Quiz {
  id: number;
  title: string;
  questions: QuizQuestion[];
  createdAt: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function Quizzes() {
  const { auth } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const res = await fetch('/api/quizzes');
        if (!res.ok) throw new Error('Failed to fetch quizzes');
        setQuizzes(await res.json());
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Failed to fetch quizzes');
        } else {
          setError('Failed to fetch quizzes');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, []);

  const [activeQuizIdx, setActiveQuizIdx] = useState(0);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});

  if (loading) return <div>Loading quizzes...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  if (quizzes.length === 0) return <div>No quizzes available yet.</div>;

  const quiz = quizzes[activeQuizIdx];
  const questions = quiz.questions;
  const currentQ = questions[activeQuestionIdx];
  const options = Array.isArray(currentQ.options) ? currentQ.options : JSON.parse(currentQ.options);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Quizzes</h2>
      <div className="mb-4">
        <span className="font-semibold">Quiz:</span> {quiz.title}
        <span className="ml-4 text-xs text-gray-400">Created: {new Date(quiz.createdAt).toLocaleString()}</span>
      </div>
      <div className="mb-4 flex gap-2 flex-wrap">
        {questions.map((_, idx) => (
          <button
            key={idx}
            className={`px-3 py-1 rounded border ${activeQuestionIdx === idx ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} hover:bg-blue-100`}
            onClick={() => setActiveQuestionIdx(idx)}
          >
            {idx + 1}
          </button>
        ))}
      </div>
      <div className="mb-4 p-4 bg-white rounded shadow">
        <div className="font-medium mb-2">Q{activeQuestionIdx + 1}: {currentQ.question}</div>
        <form>
          {options.map((opt: string, i: number) => (
            <label key={i} className="block mb-2 cursor-pointer">
              <input
                type="radio"
                name={`question-${activeQuestionIdx}`}
                value={i}
                checked={answers[`${quiz.id}-${activeQuestionIdx}`] === i}
                onChange={() => setAnswers({ ...answers, [`${quiz.id}-${activeQuestionIdx}`]: i })}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </form>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          disabled={activeQuestionIdx === 0}
          onClick={() => setActiveQuestionIdx((idx) => Math.max(0, idx - 1))}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        {activeQuestionIdx < questions.length - 1 ? (
          <button
            disabled={activeQuestionIdx === questions.length - 1}
            onClick={() => setActiveQuestionIdx((idx) => Math.min(questions.length - 1, idx + 1))}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Next
          </button>
        ) : (
          <button
            onClick={async () => {
              setSubmitting(true);
              setError(null);
              try {
                // Prepare answers as array of selected option indices
                const answerArr = questions.map((_, idx) => answers[`${quiz.id}-${idx}`]);
                const res = await fetch('/api/quiz-results', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    studentId: auth.user?.id, // use numeric user id
                    quizId: quiz.id,
                    answers: answerArr,
                  }),
                });
                if (!res.ok) throw new Error('Failed to submit quiz');
                const data = await res.json();
                setSubmitted(true);
                setScore(data.result.score);
              } catch (err: unknown) {
                if (err instanceof Error) setError(err.message);
                else setError('Failed to submit quiz');
              } finally {
                setSubmitting(false);
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </div>
      {submitted && (
        <div className="mt-6 p-4 bg-blue-100 text-blue-800 rounded">
          <div>Quiz submitted!</div>
          {score !== null && (
            <div className="mt-2">Your score: <span className="font-bold">{score}</span></div>
          )}
        </div>
      )}
      {quizzes.length > 1 && (
        <div className="mt-8">
          <span className="font-semibold">Other Quizzes:</span>
          <div className="flex gap-2 mt-2 flex-wrap">
            {quizzes.map((qz, idx) => (
              <button
                key={qz.id}
                className={`px-3 py-1 rounded border ${activeQuizIdx === idx ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'} hover:bg-green-100`}
                onClick={() => { setActiveQuizIdx(idx); setActiveQuestionIdx(0); }}
              >
                {qz.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
