"use client";

import { useEffect, useState } from "react";

interface Studio {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  capacity: number | null;
  pricePerHour: number;
  pricingType: "PER_HOUR" | "PER_DAY";
  amenities: string[];
  isActive: boolean;
}

export default function StudiosPage() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    capacity: "",
    pricePerHour: "",
    pricingType: "PER_HOUR" as "PER_HOUR" | "PER_DAY",
    amenities: "",
    isActive: true,
  });

  useEffect(() => {
    fetchStudios();
  }, []);

  async function fetchStudios() {
    try {
      const res = await fetch("/api/studios");
      const data = await res.json();
      setStudios(data);
    } catch (error) {
      console.error("Error fetching studios:", error);
    }
  }

  function handleEdit(studio: Studio) {
    setEditingId(studio.id);
    setFormData({
      name: studio.name,
      description: studio.description || "",
      location: studio.location || "",
      capacity: studio.capacity?.toString() || "",
      pricePerHour: studio.pricePerHour.toString(),
      pricingType: studio.pricingType,
      amenities: studio.amenities.join(", "),
      isActive: studio.isActive,
    });
    setShowForm(true);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      name: "",
      description: "",
      location: "",
      capacity: "",
      pricePerHour: "",
      pricingType: "PER_HOUR",
      amenities: "",
      isActive: true,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingId ? `/api/studios/${editingId}` : "/api/studios";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amenities: formData.amenities
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean),
          pricePerHour: parseFloat(formData.pricePerHour),
          capacity: formData.capacity ? parseInt(formData.capacity) : null,
        }),
      });

      if (res.ok) {
        handleCancelEdit();
        fetchStudios();
      }
    } catch (error) {
      console.error("Error saving studio:", error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      const res = await fetch(`/api/studios/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchStudios();
      }
    } catch (error) {
      console.error("Error deleting studio:", error);
    }
  }

  async function toggleStatus(id: string, currentStatus: boolean) {
    try {
      const res = await fetch(`/api/studios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (res.ok) {
        fetchStudios();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-5xl font-medium tracking-tight">
          Photography Packages
        </h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200"
          >
            Add Package
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium">
              {editingId ? "Edit Package" : "Create New Package"}
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
                Package Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder:text-white/20"
                placeholder="e.g., Graduation Package, Family Portrait"
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
                placeholder="Describe what's included in this package"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder:text-white/20"
                  placeholder="Studio location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  Max People
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder:text-white/20"
                  placeholder="5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  Pricing Type *
                </label>
                <select
                  value={formData.pricingType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pricingType: e.target.value as "PER_HOUR" | "PER_DAY",
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white"
                >
                  <option value="PER_HOUR">Per Hour</option>
                  <option value="PER_DAY">Per Day</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  Price{" "}
                  {formData.pricingType === "PER_HOUR" ? "per Hour" : "per Day"}{" "}
                  *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.pricePerHour}
                  onChange={(e) =>
                    setFormData({ ...formData, pricePerHour: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder:text-white/20"
                  placeholder="150.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Includes (comma-separated)
              </label>
              <input
                type="text"
                value={formData.amenities}
                onChange={(e) =>
                  setFormData({ ...formData, amenities: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder:text-white/20"
                placeholder="Digital copies, Prints, Retouching"
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
                  Package is active and visible to customers
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
                {editingId ? "Update Package" : "Create Package"}
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
                Package Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Max People
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Price
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
            {studios.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-white/40"
                >
                  No packages yet. Create your first photography package!
                </td>
              </tr>
            ) : (
              studios.map((studio) => (
                <tr
                  key={studio.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{studio.name}</div>
                    {studio.description && (
                      <div className="text-sm text-white/40 line-clamp-1">
                        {studio.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                    {studio.location || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                    {studio.capacity || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">
                      ${studio.pricePerHour}
                    </div>
                    <div className="text-xs text-white/40">
                      {studio.pricingType === "PER_HOUR"
                        ? "per hour"
                        : "per day"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleStatus(studio.id, studio.isActive)}
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${
                        studio.isActive
                          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      }`}
                    >
                      {studio.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleEdit(studio)}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(studio.id)}
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
