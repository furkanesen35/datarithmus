"use client";
import { useState } from "react";

interface Resource {
  id: number;
  title: string;
  category: string;
  fileName?: string;
  link?: string;
  createdAt: string;
}

interface ResourceManagerProps {
  onMessage: (msg: string) => void;
  onError: (err: string) => void;
}

export default function ResourceManager({ onMessage, onError }: ResourceManagerProps) {
  const [resourceTitle, setResourceTitle] = useState("");
  const [category, setCategory] = useState("Cheat Sheet");
  const [resourceFile, setResourceFile] = useState<File | null>(null);
  const [resourceLink, setResourceLink] = useState("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const categories = ["Cheat Sheet", "Tutorial", "Article", "Code Sample"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceTitle || (!resourceFile && !resourceLink)) {
      onError("Title and either a file or link are required");
      return;
    }

    if (editingId) {
      // Edit existing resource
      setResources(
        resources.map((res) =>
          res.id === editingId
            ? {
                ...res,
                title: resourceTitle,
                category,
                fileName: resourceFile ? resourceFile.name : res.fileName,
                link: resourceLink || res.link,
              }
            : res
        )
      );
      onMessage("Resource updated successfully");
      setEditingId(null);
    } else {
      // Create new resource
      const newResource: Resource = {
        id: Date.now(),
        title: resourceTitle,
        category,
        fileName: resourceFile ? resourceFile.name : undefined,
        link: resourceLink || undefined,
        createdAt: new Date().toISOString(),
      };
      setResources([newResource, ...resources]);
      onMessage("Resource created successfully");
    }

    setResourceTitle("");
    setCategory("Cheat Sheet");
    setResourceFile(null);
    setResourceLink("");
  };

  const handleEdit = (res: Resource) => {
    setEditingId(res.id);
    setResourceTitle(res.title);
    setCategory(res.category);
    setResourceFile(null); // File reset on edit
    setResourceLink(res.link || "");
  };

  const handleDelete = (id: number) => {
    setResources(resources.filter((res) => res.id !== id));
    onMessage("Resource deleted successfully");
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {editingId ? "Edit Resource" : "Add Resource"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="resourceTitle" className="block text-sm font-medium">
            Resource Title
          </label>
          <input
            type="text"
            id="resourceTitle"
            value={resourceTitle}
            onChange={(e) => setResourceTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="resourceFile" className="block text-sm font-medium">
            File (Optional)
          </label>
          <input
            type="file"
            id="resourceFile"
            accept=".pdf,.doc,.docx,.zip"
            onChange={(e) => setResourceFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <label htmlFor="resourceLink" className="block text-sm font-medium">
            Link (Optional)
          </label>
          <input
            type="url"
            id="resourceLink"
            value={resourceLink}
            onChange={(e) => setResourceLink(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            placeholder="https://example.com"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {editingId ? "Update Resource" : "Add Resource"}
          </button>
          {editingId && (
            <button
              type="button"
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={() => {
                setEditingId(null);
                setResourceTitle("");
                setCategory("Cheat Sheet");
                setResourceFile(null);
                setResourceLink("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Resources List */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Resources</h3>
        {resources.length === 0 ? (
          <p>No resources added yet.</p>
        ) : (
          <ul className="space-y-4">
            {resources.map((res) => (
              <li key={res.id} className="p-4 bg-white border border-gray-300 rounded-md">
                <h4 className="text-md font-medium">{res.title}</h4>
                <p className="text-sm">Category: {res.category}</p>
                {res.fileName && <p className="text-sm">File: {res.fileName}</p>}
                {res.link && (
                  <p className="text-sm">
                    Link: <a href={res.link} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">{res.link}</a>
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Created: {new Date(res.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(res)}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(res.id)}
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