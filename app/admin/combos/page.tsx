"use client";

import { useEffect, useState } from "react";

interface Accessory {
  id: string;
  name: string;
  pricePerDay: number;
}

interface ComboItem {
  id: string;
  accessory: Accessory;
  quantity: number;
}

interface Combo {
  id: string;
  name: string;
  description: string | null;
  price: number;
  images: string[];
  isActive: boolean;
  order: number;
  items: ComboItem[];
}

interface FormItem {
  accessoryId: string;
  quantity: number;
}

export default function AdminCombosPage() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    images: "",
    isActive: true,
    order: "0",
  });
  const [formItems, setFormItems] = useState<FormItem[]>([]);

  useEffect(() => {
    fetchCombos();
    fetchAccessories();
  }, []);

  async function fetchCombos() {
    try {
      const res = await fetch("/api/accessory-combos");
      const data = await res.json();
      setCombos(data);
    } catch (error) {
      console.error("Error fetching combos:", error);
    }
  }

  async function fetchAccessories() {
    try {
      const res = await fetch("/api/accessories");
      const data = await res.json();
      setAccessories(data);
    } catch (error) {
      console.error("Error fetching accessories:", error);
    }
  }

  function handleEdit(combo: Combo) {
    setEditingId(combo.id);
    setFormData({
      name: combo.name,
      description: combo.description || "",
      price: combo.price.toString(),
      images: combo.images.join(", "),
      isActive: combo.isActive,
      order: combo.order.toString(),
    });
    setFormItems(
      combo.items.map((item) => ({
        accessoryId: item.accessory.id,
        quantity: item.quantity,
      })),
    );
    setShowForm(true);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      name: "",
      description: "",
      price: "",
      images: "",
      isActive: true,
      order: "0",
    });
    setFormItems([]);
  }

  function addItem() {
    setFormItems([...formItems, { accessoryId: "", quantity: 1 }]);
  }

  function removeItem(index: number) {
    setFormItems(formItems.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof FormItem, value: string | number) {
    const updated = [...formItems];
    if (field === "quantity") {
      updated[index].quantity = Number(value);
    } else {
      updated[index].accessoryId = value as string;
    }
    setFormItems(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingId
        ? `/api/accessory-combos/${editingId}`
        : "/api/accessory-combos";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          price: parseFloat(formData.price),
          images: formData.images
            .split(",")
            .map((img) => img.trim())
            .filter(Boolean),
          isActive: formData.isActive,
          order: parseInt(formData.order),
          items: formItems.filter((item) => item.accessoryId),
        }),
      });

      if (res.ok) {
        handleCancelEdit();
        fetchCombos();
      }
    } catch (error) {
      console.error("Error saving combo:", error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this combo?")) return;

    try {
      const res = await fetch(`/api/accessory-combos/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchCombos();
      }
    } catch (error) {
      console.error("Error deleting combo:", error);
    }
  }

  async function toggleStatus(id: string, currentStatus: boolean) {
    try {
      const res = await fetch(`/api/accessory-combos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (res.ok) {
        fetchCombos();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-5xl font-medium tracking-tight">
          Combo Packages
        </h1>
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setFormItems([{ accessoryId: "", quantity: 1 }]);
            }}
            className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200"
          >
            Add Combo
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium">
              {editingId ? "Edit Combo" : "Create New Combo"}
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
                Combo Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder:text-white/20"
                placeholder="e.g., Wedding Photography Combo"
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
                placeholder="Describe what this combo package includes"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  Combo Price (RM) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder:text-white/20"
                  placeholder="150.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder:text-white/20"
                  placeholder="0"
                />
              </div>
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

            {/* Combo Items */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-white/60">
                  Included Accessories
                </label>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-sm text-white/60 hover:text-white transition-colors px-3 py-1 border border-white/10 rounded-full hover:border-white/20"
                >
                  + Add Item
                </button>
              </div>
              <div className="space-y-3">
                {formItems.map((item, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <select
                      value={item.accessoryId}
                      onChange={(e) =>
                        updateItem(index, "accessoryId", e.target.value)
                      }
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white"
                    >
                      <option value="" className="bg-black">
                        Select accessory...
                      </option>
                      {accessories.map((a) => (
                        <option key={a.id} value={a.id} className="bg-black">
                          {a.name} (RM{a.pricePerDay}/day)
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", e.target.value)
                      }
                      className="w-20 px-3 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white text-center"
                      placeholder="Qty"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
                {formItems.length === 0 && (
                  <p className="text-white/30 text-sm py-2">
                    No accessories added yet. Click &quot;+ Add Item&quot; to include accessories.
                  </p>
                )}
              </div>
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
                  Combo is active and visible
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
                {editingId ? "Update Combo" : "Create Combo"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Combos List */}
      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <table className="min-w-full divide-y divide-white/10">
          <thead>
            <tr className="bg-white/5">
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Combo Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Items
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
            {combos.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-white/40"
                >
                  No combo packages yet. Create your first combo!
                </td>
              </tr>
            ) : (
              combos.map((combo) => (
                <tr
                  key={combo.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{combo.name}</div>
                    {combo.description && (
                      <div className="text-sm text-white/40 line-clamp-1">
                        {combo.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/60">
                    {combo.items.length === 0
                      ? "-"
                      : combo.items
                          .map(
                            (item) =>
                              `${item.quantity > 1 ? item.quantity + "x " : ""}${item.accessory.name}`,
                          )
                          .join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    RM{combo.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() =>
                        toggleStatus(combo.id, combo.isActive)
                      }
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${
                        combo.isActive
                          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      }`}
                    >
                      {combo.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleEdit(combo)}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(combo.id)}
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
