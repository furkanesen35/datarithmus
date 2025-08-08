// Dashboard Discussion Tab
'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface User {
  username: string;
  email: string;
}

interface Comment {
  id: number;
  content: string;
  author: User;
  createdAt: string;
}

interface Discussion {
  id: number;
  title: string;
  content: string;
  author: User;
  pinned: boolean;
  createdAt: string;
  comments: Comment[];
}

export default function Discussion() {
  const { auth } = useAuth();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '' });
  const [newComments, setNewComments] = useState<Record<number, string>>({});

  useEffect(() => {
    fetchDiscussions();
  }, []);

  async function fetchDiscussions() {
    try {
      const res = await fetch('/api/discussion');
      if (!res.ok) throw new Error('Failed to fetch discussions');
      setDiscussions(await res.json());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch discussions');
    } finally {
      setLoading(false);
    }
  }

  async function createDiscussion(e: React.FormEvent) {
    e.preventDefault();
    if (!newDiscussion.title || !newDiscussion.content || !auth.user?.id) return;

    try {
      const res = await fetch('/api/discussion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newDiscussion.title,
          content: newDiscussion.content,
          authorId: auth.user.id
        })
      });

      if (!res.ok) throw new Error('Failed to create discussion');
      
      setNewDiscussion({ title: '', content: '' });
      setShowNewDiscussion(false);
      fetchDiscussions();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create discussion');
    }
  }

  async function addComment(discussionId: number) {
    const commentContent = newComments[discussionId];
    if (!commentContent || !auth.user?.id) return;

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: commentContent,
          authorId: auth.user.id,
          discussionId
        })
      });

      if (!res.ok) throw new Error('Failed to add comment');
      
      setNewComments(prev => ({ ...prev, [discussionId]: '' }));
      fetchDiscussions();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
    }
  }

  if (loading) return <div>Loading discussions...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Discussions</h2>
        <button
          onClick={() => setShowNewDiscussion(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          New Discussion
        </button>
      </div>

      {showNewDiscussion && (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold mb-2">Create New Discussion</h3>
          <form onSubmit={createDiscussion}>
            <input
              type="text"
              placeholder="Discussion title"
              value={newDiscussion.title}
              onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border rounded mb-2"
              required
            />
            <textarea
              placeholder="Discussion content"
              value={newDiscussion.content}
              onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
              className="w-full p-2 border rounded mb-2 h-24"
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowNewDiscussion(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {discussions.length === 0 ? (
        <div>No discussions yet.</div>
      ) : (
        <div className="space-y-6">
          {discussions.map(d => (
            <div key={d.id} className={`p-4 rounded shadow ${d.pinned ? 'bg-yellow-100' : 'bg-white'}`}>
              <div className="font-semibold text-lg">{d.title}</div>
              <div className="text-gray-700 mb-2">{d.content}</div>
              <div className="text-xs text-gray-500 mb-4">
                By {d.author.username} • {new Date(d.createdAt).toLocaleString()}
                {d.pinned && <span className="text-yellow-700 font-bold ml-2">Pinned</span>}
              </div>

              {/* Comments section */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-sm mb-2">Comments ({d.comments.length})</h4>
                
                {d.comments.map(comment => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded mb-2">
                    <div className="text-sm">{comment.content}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      By {comment.author.username} • {new Date(comment.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}

                {/* Add comment form */}
                <div className="mt-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComments[d.id] || ''}
                      onChange={(e) => setNewComments(prev => ({ ...prev, [d.id]: e.target.value }))}
                      className="flex-1 p-2 border rounded text-sm"
                    />
                    <button
                      onClick={() => addComment(d.id)}
                      className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
