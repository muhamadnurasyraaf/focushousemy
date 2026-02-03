"use client";

import { useEffect, useState } from "react";

interface Accessory {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  quantity: number;
  pricePerDay: number;
  images: string[];
  isActive: boolean;
}

export default function AccessoriesPage() {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    quantity: "1",
    pricePerDay: "",
    images: "",
    isActive: true,
  });

  useEffect(() => {
    fetchAccessories();
  }, []);

  async function fetchAccessories() {
    try {
      const res = await fetch("/api/accessories");
      const data = await res.json();
      setAccessories(data);
    } catch (error) {
      console.error("Error fetching accessories:", error);
    }
  }

  function handleEdit(accessory: Accessory) {
    setEditingId(accessory.id);
    setFormData({
      name: accessory.name,
      description: accessory.description || "",
      category: accessory.category || "",
      quantity: accessory.quantity.toString(),
      pricePerDay: accessory.pricePerDay.toString(),
      images: accessory.images.join(", "),
      isActive: accessory.isActive,
    });
    setShowForm(true);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      name: "",
      description: "",
      category: "",
      quantity: "1",
      pricePerDay: "",
      images: "",
      isActive: true,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingId ? `/api/accessories/${editingId}` : "/api/accessories";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: formData.images
            .split(",")
            .map((img) => img.trim())
            .filter(Boolean),
          pricePerDay: parseFloat(formData.pricePerDay),
          quantity: parseInt(formData.quantity),
        }),
      });

      if (res.ok) {
        handleCancelEdit();
        fetchAccessories();
      }
    } catch (error) {
      console.error("Error saving accessory:", error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this accessory?")) return;

    try {
      const res = await fetch(`/api/accessories/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchAccessories();
      }
    } catch (error) {
      console.error("Error deleting accessory:", error);
    }
  }

  async function toggleStatus(id: string, currentStatus: boolean) {
    try {
      const res = await fetch(`/api/accessories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (res.ok) {
        fetchAccessories();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-5xl font-medium tracking-tight">
          Accessories & Cameras
        </h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200"
          >
            Add Accessory
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium">
              {editingId ? "Edit Accessory" : "Create New Accessory"}
            </h2>
            <button
              onClick={handleCancelEdit}
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Accessory Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder:text-white/20"
                placeholder="e.g., Canon EOS R5, Lighting Kit, Backdrop Stand"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder:text-white/20 resize-none"
                placeholder="Describe the accessory specifications and features"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder:text-white/20"
                  placeholder="Camera, Lens, Lighting, Backdrop"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  Quantity Available *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder:text-white/20"
                  placeholder="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Price per Day *
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.pricePerDay}
                onChange={(e) =>
                  setFormData({ ...formData, pricePerDay: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder:text-white/20"
                placeholder="50.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Images (comma-separated URLs)
              </label>
              <input
                type="text"
                value={formData.images}
                onChange={(e) =>
                  setFormData({ ...formData, images: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder:text-white/20"
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
            </div>

            {editingId && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-white focus:ring-white/30"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 text-sm text-white/60"
                >
                  Accessory is active and available for rental
                </label>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-8 py-3 border border-white/20 rounded-full font-medium hover:bg-white/5 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200"
              >
                {editingId ? "Update Accessory" : "Create Accessory"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <table className="min-w-full divide-y divide-white/10">
          <thead>
            <tr className="bg-white/5">
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Item Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Price/Day
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-white/60 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {accessories.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-white/40"
                >
                  No accessories yet. Create your first accessory listing!
                </td>
              </tr>
            ) : (
              accessories.map((accessory) => (
                <tr
                  key={accessory.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{accessory.name}</div>
                    {accessory.description && (
                      <div className="text-sm text-white/40 line-clamp-1">
                        {accessory.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                    {accessory.category || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                    {accessory.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    ${accessory.pricePerDay}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleStatus(accessory.id, accessory.isActive)}
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${
                        accessory.isActive
                          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      }`}
                    >
                      {accessory.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleEdit(accessory)}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(accessory.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
