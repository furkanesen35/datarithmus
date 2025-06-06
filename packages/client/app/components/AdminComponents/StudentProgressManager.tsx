// packages/client/app/components/AdminComponents/StudentProgressManager.tsx
'use client';
import { useEffect, useState } from 'react';

interface Student {
  id: number;
  email: string;
  username: string;
}
interface Quiz {
  id: number;
  title: string;
  questions: QuizQuestion[];
}
interface QuizQuestion {
  id: number;
  question: string;
}
interface QuizResult {
  questionId: number;
  answer: number;
  isCorrect: boolean;
}
interface StudentQuizResults {
  [questionId: number]: QuizResult;
}

export default function StudentProgressManager() {
  const [students, setStudents] = useState<Student[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<{
    [userId: number]: StudentQuizResults;
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const res = await fetch('/api/student-progress', {
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      setStudents(data.students);
      setQuizzes(data.quizzes);
      setResults(data.results);
    }
    setLoading(false);
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Student Quiz Progress</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr>
                <th className="border px-2 py-1">Student</th>
                {quizzes.flatMap((quiz) =>
                  quiz.questions.map((q) => (
                    <th key={q.id} className="border px-2 py-1">
                      {quiz.title} <br />
                      Q: {q.question}
                    </th>
                  )),
                )}
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="border px-2 py-1">
                    {student.username} <br />
                    <span className="text-xs text-gray-500">
                      {student.email}
                    </span>
                  </td>
                  {quizzes.flatMap((quiz) =>
                    quiz.questions.map((q) => {
                      const result = results[student.id]?.[q.id];
                      return (
                        <td key={q.id} className="border px-2 py-1 text-center">
                          {result ? (
                            <span
                              className={
                                result.isCorrect
                                  ? 'text-green-600 font-bold'
                                  : 'text-red-600 font-bold'
                              }
                            >
                              {result.isCorrect ? '✔' : '✗'} (Ans:{' '}
                              {result.answer + 1})
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      );
                    }),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
