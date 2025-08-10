// Dashboard Feedback Component
'use client';
import { useState, useEffect } from 'react';

interface FeedbackQuestion {
  id: number;
  question: string;
}

interface FeedbackForm {
  id: number;
  title: string;
  questions: FeedbackQuestion[];
  isCompleted: boolean;
  userResponses: Array<{
    questionId: number;
    rating: number;
    comment?: string;
  }>;
}

interface FeedbackResponse {
  questionId: number;
  rating: number;
  comment?: string;
}

export default function Feedback() {
  const [forms, setForms] = useState<FeedbackForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<FeedbackForm | null>(null);
  const [responses, setResponses] = useState<{
    [questionId: number]: FeedbackResponse;
  }>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailableForms();
  }, []);

  async function fetchAvailableForms() {
    setLoading(true);
    try {
      const res = await fetch('/api/feedback/available');
      if (!res.ok) throw new Error('Failed to fetch feedback forms');
      const data = await res.json();
      setForms(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to load feedback forms');
      } else {
        setError('Failed to load feedback forms');
      }
    } finally {
      setLoading(false);
    }
  }

  function selectForm(form: FeedbackForm) {
    setSelectedForm(form);
    setMessage(null);
    setError(null);

    // Pre-populate with existing responses if form is completed
    const responseMap: { [questionId: number]: FeedbackResponse } = {};
    form.userResponses.forEach((response) => {
      responseMap[response.questionId] = {
        questionId: response.questionId,
        rating: response.rating,
        comment: response.comment,
      };
    });
    setResponses(responseMap);
  }

  function updateResponse(
    questionId: number,
    field: 'rating' | 'comment',
    value: number | string,
  ) {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionId,
        [field]: value,
        rating:
          field === 'rating'
            ? (value as number)
            : prev[questionId]?.rating || 5,
      },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedForm) return;

    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      // Validate all questions have ratings
      const responseArray = selectedForm.questions.map((question) => {
        const response = responses[question.id];
        if (!response || response.rating === undefined) {
          throw new Error(`Please provide a rating for: ${question.question}`);
        }
        return response;
      });

      const res = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: selectedForm.id,
          responses: responseArray,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit feedback');

      setMessage('Feedback submitted successfully!');

      // Refresh forms to update completion status
      await fetchAvailableForms();

      // Update selected form completion status
      setSelectedForm((prev) => (prev ? { ...prev, isCompleted: true } : null));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to submit feedback');
      } else {
        setError('Failed to submit feedback');
      }
    } finally {
      setSubmitting(false);
    }
  }

  function StarRating({
    rating,
    onRatingChange,
  }: {
    rating: number;
    onRatingChange: (rating: number) => void;
  }) {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
          >
            ★
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
        <div className="text-center">Loading feedback forms...</div>
      </div>
    );
  }

  if (!selectedForm) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6">Feedback Forms</h2>

        {forms.length === 0 ? (
          <div className="text-center text-gray-500">
            No feedback forms available at the moment.
          </div>
        ) : (
          <div className="space-y-4">
            {forms.map((form) => (
              <div
                key={form.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  form.isCompleted
                    ? 'bg-green-50 border-green-200 hover:bg-green-100'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => selectForm(form)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{form.title}</h3>
                    <p className="text-sm text-gray-600">
                      {form.questions.length} question
                      {form.questions.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {form.isCompleted && (
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                        Completed
                      </span>
                    )}
                    <button className="text-blue-600 hover:text-blue-800">
                      {form.isCompleted ? 'View/Edit' : 'Fill Out'} →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <div className="text-red-600 mt-4">{error}</div>}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setSelectedForm(null)}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Forms
        </button>
        <h2 className="text-2xl font-bold">{selectedForm.title}</h2>
        {selectedForm.isCompleted && (
          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
            Completed
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {selectedForm.questions.map((question, index) => (
          <div key={question.id} className="p-4 border rounded-lg">
            <div className="mb-3">
              <h3 className="font-medium text-lg">
                {index + 1}. {question.question}
              </h3>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating (1-5 stars)
              </label>
              <StarRating
                rating={responses[question.id]?.rating || 5}
                onRatingChange={(rating) =>
                  updateResponse(question.id, 'rating', rating)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Comments (Optional)
              </label>
              <textarea
                value={responses[question.id]?.comment || ''}
                onChange={(e) =>
                  updateResponse(question.id, 'comment', e.target.value)
                }
                className="w-full p-3 border rounded-md"
                rows={3}
                placeholder="Share any additional thoughts..."
              />
            </div>
          </div>
        ))}

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={submitting}
          >
            {submitting
              ? 'Submitting...'
              : selectedForm.isCompleted
                ? 'Update Feedback'
                : 'Submit Feedback'}
          </button>
        </div>

        {message && <div className="text-green-600 mt-4">{message}</div>}
        {error && <div className="text-red-600 mt-4">{error}</div>}
      </form>
    </div>
  );
}
