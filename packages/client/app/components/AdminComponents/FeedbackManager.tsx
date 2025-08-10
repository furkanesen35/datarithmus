// packages/client/app/components/AdminComponents/FeedbackManager.tsx
'use client';
import React, { useState, useEffect } from 'react';

interface FeedbackQuestion {
  id: number;
  question: string;
  responses: Array<{
    id: number;
    rating: number;
    comment?: string;
    student: {
      username: string;
      email: string;
    };
  }>;
}

interface FeedbackForm {
  id: number;
  title: string;
  createdAt: string;
  questions: FeedbackQuestion[];
  _count: {
    responses: number;
  };
}

interface FeedbackManagerProps {
  onMessage: (msg: string) => void;
  onError: (err: string) => void;
}

export default function FeedbackManager({
  onMessage,
  onError,
}: FeedbackManagerProps) {
  const [forms, setForms] = useState<FeedbackForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<FeedbackForm | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFormTitle, setNewFormTitle] = useState('');
  const [newFormQuestions, setNewFormQuestions] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);

  const fetchForms = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/feedback/forms', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch feedback forms');
      const data = await res.json();
      setForms(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        onError(err.message || 'Failed to fetch feedback forms');
      } else {
        onError('Failed to fetch feedback forms');
      }
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormTitle.trim()) {
      onError('Form title is required');
      return;
    }

    const validQuestions = newFormQuestions.filter((q) => q.trim());
    if (validQuestions.length === 0) {
      onError('At least one question is required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/feedback/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: newFormTitle,
          questions: validQuestions,
        }),
      });

      if (!res.ok) throw new Error('Failed to create feedback form');

      await fetchForms();
      onMessage('Feedback form created successfully');
      setShowCreateForm(false);
      setNewFormTitle('');
      setNewFormQuestions(['']);
    } catch (err: unknown) {
      if (err instanceof Error) {
        onError(err.message || 'Failed to create feedback form');
      } else {
        onError('Failed to create feedback form');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteForm = async (id: number) => {
    if (
      !confirm(
        'Are you sure you want to delete this feedback form? This will also delete all responses.',
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/feedback/forms', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error('Failed to delete feedback form');

      await fetchForms();
      onMessage('Feedback form deleted successfully');
      if (selectedForm?.id === id) {
        setSelectedForm(null);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        onError(err.message || 'Failed to delete feedback form');
      } else {
        onError('Failed to delete feedback form');
      }
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setNewFormQuestions([...newFormQuestions, '']);
  };

  const updateQuestion = (index: number, value: string) => {
    const updated = [...newFormQuestions];
    updated[index] = value;
    setNewFormQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    if (newFormQuestions.length > 1) {
      setNewFormQuestions(newFormQuestions.filter((_, i) => i !== index));
    }
  };

  const calculateAverageRating = (responses: FeedbackQuestion['responses']) => {
    if (responses.length === 0) return 0;
    const sum = responses.reduce((acc, response) => acc + response.rating, 0);
    return (sum / responses.length).toFixed(1);
  };

  if (selectedForm) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedForm(null)}
            className="text-blue-500 hover:text-blue-700"
          >
            ← Back to Forms
          </button>
          <h2 className="text-2xl font-semibold">{selectedForm.title}</h2>
        </div>

        <div className="space-y-6">
          {selectedForm.questions.map((question, questionIndex) => {
            const responses = question.responses ?? [];
            return (
              <div
                key={question.id}
                className="bg-white p-6 border border-gray-300 rounded-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium">
                    {questionIndex + 1}. {question.question}
                  </h3>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {responses.length} response
                      {responses.length !== 1 ? 's' : ''}
                    </div>
                    {responses.length > 0 && (
                      <div className="text-lg font-semibold text-blue-600">
                        ★ {calculateAverageRating(responses)}/5
                      </div>
                    )}
                  </div>
                </div>

                {responses.length === 0 ? (
                  <p className="text-gray-500 italic">No responses yet</p>
                ) : (
                  <div className="space-y-3">
                    {responses.map((response) => (
                      <div
                        key={response.id}
                        className="p-3 bg-gray-50 rounded border"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-sm font-medium text-gray-700">
                            {response.student.username} (
                            {response.student.email})
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">
                              {'★'.repeat(response.rating)}
                            </span>
                            <span className="text-gray-400">
                              {'☆'.repeat(5 - response.rating)}
                            </span>
                            <span className="ml-1 text-sm">
                              ({response.rating}/5)
                            </span>
                          </div>
                        </div>
                        {response.comment && (
                          <p className="text-sm text-gray-600 mt-2">
                            &quot;{response.comment}&quot;
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t">
          <button
            onClick={() => handleDeleteForm(selectedForm.id)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            disabled={loading}
          >
            Delete Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Feedback Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create New Form
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6 p-6 bg-gray-50 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Create Feedback Form</h3>
          <form onSubmit={handleCreateForm} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Form Title
              </label>
              <input
                type="text"
                id="title"
                value={newFormTitle}
                onChange={(e) => setNewFormTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                placeholder="e.g., Course Feedback Survey"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Questions
              </label>
              {newFormQuestions.map((question, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => updateQuestion(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-black"
                    placeholder={`Question ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    disabled={newFormQuestions.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addQuestion}
                className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Question
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={loading}
              >
                Create Form
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewFormTitle('');
                  setNewFormQuestions(['']);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Existing Forms</h3>
        {loading ? (
          <p>Loading...</p>
        ) : forms.length === 0 ? (
          <p className="text-gray-500">No feedback forms created yet.</p>
        ) : (
          <div className="grid gap-4">
            {forms.map((form) => (
              <div
                key={form.id}
                className="p-4 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium">{form.title}</h4>
                    <p className="text-sm text-gray-600">
                      {form.questions.length} question
                      {form.questions.length !== 1 ? 's' : ''} •
                      {form._count.responses} response
                      {form._count.responses !== 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(form.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedForm(form)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeleteForm(form.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
