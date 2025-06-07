// packages/client/app/components/AdminComponents/DiscussionManager.tsx
'use client';
import { useEffect, useState } from 'react';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  pinned: boolean;
  createdAt: string;
}

interface DiscussionManagerProps {
  onMessage: (msg: string) => void;
  onError: (err: string) => void;
}

export default function DiscussionManager({
  onMessage,
  onError,
}: DiscussionManagerProps) {
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/discussion', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch posts');
      setPosts(await res.json());
    } catch (err: unknown) {
      if (err instanceof Error) {
        onError(err.message || 'Failed to fetch posts');
      } else {
        onError('Failed to fetch posts');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postContent) {
      onError('Title and content are required');
      return;
    }
    setLoading(true);
    try {
      let res;
      if (editingId) {
        res = await fetch('/api/discussion', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            id: editingId,
            title: postTitle,
            content: postContent,
            author: 'Teacher',
            pinned: isPinned,
          }),
        });
      } else {
        res = await fetch('/api/discussion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            title: postTitle,
            content: postContent,
            author: 'Teacher',
            pinned: isPinned,
          }),
        });
      }
      if (!res.ok) throw new Error('Failed to save post');
      await fetchPosts();
      onMessage(
        editingId ? 'Post updated successfully' : 'Post created successfully',
      );
      setEditingId(null);
      setPostTitle('');
      setPostContent('');
      setIsPinned(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        onError(err.message || 'Failed to save post');
      } else {
        onError('Failed to save post');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingId(post.id);
    setPostTitle(post.title);
    setPostContent(post.content);
    setIsPinned(post.pinned);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch('/api/discussion', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete post');
      await fetchPosts();
      onMessage('Post deleted successfully');
    } catch (err: unknown) {
      if (err instanceof Error) {
        onError(err.message || 'Failed to delete post');
      } else {
        onError('Failed to delete post');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePin = async (id: number, pinned: boolean) => {
    setLoading(true);
    try {
      const post = posts.find((p) => p.id === id);
      if (!post) return;
      const res = await fetch('/api/discussion', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id,
          title: post.title,
          content: post.content,
          author: post.author,
          pinned: !pinned,
        }),
      });
      if (!res.ok) throw new Error('Failed to toggle pin');
      await fetchPosts();
      onMessage('Post pin toggled');
    } catch (err: unknown) {
      if (err instanceof Error) {
        onError(err.message || 'Failed to toggle pin');
      } else {
        onError('Failed to toggle pin');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {editingId ? 'Edit Post' : 'Add Post'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="postTitle" className="block text-sm font-medium">
            Post Title
          </label>
          <input
            type="text"
            id="postTitle"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
          />
        </div>
        <div>
          <label htmlFor="postContent" className="block text-sm font-medium">
            Content
          </label>
          <textarea
            id="postContent"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            rows={4}
          />
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="mr-2"
            />
            Pin this post
          </label>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {editingId ? 'Update Post' : 'Create Post'}
          </button>
          {editingId && (
            <button
              type="button"
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={() => {
                setEditingId(null);
                setPostTitle('');
                setPostContent('');
                setIsPinned(false);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Posts List */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Discussion Posts</h3>
        {loading ? (
          <p>Loading...</p>
        ) : posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li
                key={post.id}
                className="p-4 bg-white border border-gray-300 rounded-md"
              >
                <h4 className="text-md font-medium">
                  {post.title}{' '}
                  {post.pinned && (
                    <span className="text-yellow-500">[Pinned]</span>
                  )}
                </h4>
                <p className="text-sm">{post.content}</p>
                <p className="text-sm">Author: {post.author}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Created: {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(post)}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => togglePin(post.id, post.pinned)}
                    className="text-gray-500 hover:underline text-sm"
                  >
                    {post.pinned ? 'Unpin' : 'Pin'}
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
