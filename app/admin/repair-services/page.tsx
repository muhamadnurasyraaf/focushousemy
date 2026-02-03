"use client";

import { useEffect, useState } from "react";

interface RepairService {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  isActive: boolean;
}

export default function RepairServicesPage() {
  const [services, setServices] = useState<RepairService[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    isActive: true,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      const res = await fetch("/api/repair-services");
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching repair services:", error);
    }
  }

  function handleEdit(service: RepairService) {
    setEditingId(service.id);
    setFormData({
      name: service.name,
      description: service.description || "",
      basePrice: service.basePrice.toString(),
      isActive: service.isActive,
    });
    setShowForm(true);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      name: "",
      description: "",
      basePrice: "",
      isActive: true,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingId ? `/api/repair-services/${editingId}` : "/api/repair-services";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          basePrice: parseFloat(formData.basePrice),
        }),
      });

      if (res.ok) {
        handleCancelEdit();
        fetchServices();
      }
    } catch (error) {
      console.error("Error saving repair service:", error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this repair service?")) return;

    try {
      const res = await fetch(`/api/repair-services/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error("Error deleting repair service:", error);
    }
  }

  async function toggleStatus(id: string, currentStatus: boolean) {
    try {
      const res = await fetch(`/api/repair-services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (res.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-5xl font-medium tracking-tight">
          Repair Services
        </h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200"
          >
            Add Service
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium">
              {editingId ? "Edit Repair Service" : "Create New Repair Service"}
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
                Service Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder:text-white/20"
                placeholder="e.g., Camera Sensor Cleaning, Lens Repair, Flash Unit Repair"
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
                placeholder="Describe what this service includes and typical turnaround time"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Base Price *
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.basePrice}
                onChange={(e) =>
                  setFormData({ ...formData, basePrice: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder:text-white/20"
                placeholder="75.00"
              />
              <p className="mt-2 text-xs text-white/40">
                Starting price for this service. Final price may vary based on specific repair needs.
              </p>
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
                  Service is active and accepting requests
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
                {editingId ? "Update Service" : "Create Service"}
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
                Service Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Base Price
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
            {services.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-white/40"
                >
                  No repair services yet. Create your first repair service offering!
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr
                  key={service.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{service.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    {service.description ? (
                      <div className="text-sm text-white/60 line-clamp-2 max-w-md">
                        {service.description}
                      </div>
                    ) : (
                      <span className="text-white/40">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    ${service.basePrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleStatus(service.id, service.isActive)}
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${
                        service.isActive
                          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      }`}
                    >
                      {service.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
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
