// Admin Discussion Management Component
'use client';
import { useEffect, useState } from 'react';

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

interface DiscussionManagerProps {
  onMessage: (msg: string) => void;
  onError: (err: string) => void;
}

export default function DiscussionManager({
  onMessage,
  onError,
}: DiscussionManagerProps) {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiscussions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchDiscussions() {
    try {
      const res = await fetch('/api/discussion');
      if (!res.ok) throw new Error('Failed to fetch discussions');
      setDiscussions(await res.json());
    } catch (err: unknown) {
      onError(
        err instanceof Error ? err.message : 'Failed to fetch discussions',
      );
    } finally {
      setLoading(false);
    }
  }

  async function deleteDiscussion(id: number) {
    if (!confirm('Are you sure you want to delete this discussion?')) return;

    try {
      const res = await fetch('/api/discussion', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error('Failed to delete discussion');
      onMessage('Discussion deleted successfully');
      fetchDiscussions();
    } catch (err: unknown) {
      onError(
        err instanceof Error ? err.message : 'Failed to delete discussion',
      );
    }
  }

  async function togglePin(discussion: Discussion) {
    try {
      const res = await fetch('/api/discussion', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: discussion.id,
          title: discussion.title,
          content: discussion.content,
          pinned: !discussion.pinned,
        }),
      });

      if (!res.ok) throw new Error('Failed to update discussion');
      onMessage(
        `Discussion ${discussion.pinned ? 'unpinned' : 'pinned'} successfully`,
      );
      fetchDiscussions();
    } catch (err: unknown) {
      onError(
        err instanceof Error ? err.message : 'Failed to update discussion',
      );
    }
  }

  async function deleteComment(commentId: number) {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const res = await fetch('/api/comments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: commentId }),
      });

      if (!res.ok) throw new Error('Failed to delete comment');
      onMessage('Comment deleted successfully');
      fetchDiscussions();
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : 'Failed to delete comment');
    }
  }

  if (loading) return <div>Loading discussions...</div>;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Discussion Management</h2>

      {discussions.length === 0 ? (
        <div>No discussions yet.</div>
      ) : (
        <div className="space-y-6">
          {discussions.map((d) => (
            <div
              key={d.id}
              className={`p-4 rounded shadow border ${d.pinned ? 'bg-yellow-50 border-yellow-300' : 'bg-white border-gray-200'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="font-semibold text-lg">{d.title}</div>
                  <div className="text-gray-700 mb-2">{d.content}</div>
                  <div className="text-xs text-gray-500">
                    By {d.author.username} ({d.author.email}) •{' '}
                    {new Date(d.createdAt).toLocaleString()}
                    {d.pinned && (
                      <span className="text-yellow-700 font-bold ml-2">
                        📌 Pinned
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => togglePin(d)}
                    className={`px-3 py-1 text-sm rounded ${
                      d.pinned
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : 'bg-gray-500 text-white hover:bg-gray-600'
                    }`}
                  >
                    {d.pinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button
                    onClick={() => deleteDiscussion(d.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Comments section */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold text-sm mb-2">
                  Comments ({d.comments.length})
                </h4>

                {d.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-gray-50 p-3 rounded mb-2 flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <div className="text-sm">{comment.content}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        By {comment.author.username} ({comment.author.email}) •{' '}
                        {new Date(comment.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                ))}

                {d.comments.length === 0 && (
                  <div className="text-gray-500 text-sm italic">
                    No comments yet.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
