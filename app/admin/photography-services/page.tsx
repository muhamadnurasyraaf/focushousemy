"use client";

import { useEffect, useState } from "react";

interface PhotographyService {
  id: string;
  title: string;
  description: string | null;
  details: string | null;
  price: number | null;
  duration: string | null;
  mainImage: string | null;
  galleryImages: string[];
  features: string[];
  category: string;
  isActive: boolean;
  order: number;
}

export default function PhotographyServicesPage() {
  const [services, setServices] = useState<PhotographyService[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    details: "",
    price: "",
    duration: "",
    mainImage: "",
    galleryImages: [] as string[],
    features: "",
    category: "PHOTOGRAPHY",
    isActive: true,
    order: "0",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      const res = await fetch("/api/photography-services");
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  }

  function handleEdit(service: PhotographyService) {
    setEditingId(service.id);
    setFormData({
      title: service.title,
      description: service.description || "",
      details: service.details || "",
      price: service.price?.toString() || "",
      duration: service.duration || "",
      mainImage: service.mainImage || "",
      galleryImages: service.galleryImages || [],
      features: service.features.join(", "),
      category: service.category,
      isActive: service.isActive,
      order: service.order.toString(),
    });
    setShowForm(true);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      title: "",
      description: "",
      details: "",
      price: "",
      duration: "",
      mainImage: "",
      galleryImages: [],
      features: "",
      category: "PHOTOGRAPHY",
      isActive: true,
      order: "0",
    });
  }

  async function handleMainImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMain(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const res = await fetch("/api/upload/photography-image", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();
      if (res.ok) {
        setFormData({ ...formData, mainImage: data.path });
      } else {
        alert(data.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploadingMain(false);
    }
  }

  async function handleGalleryImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        const res = await fetch("/api/upload/photography-image", {
          method: "POST",
          body: formDataUpload,
        });

        const data = await res.json();
        return res.ok ? data.path : null;
      });

      const uploadedPaths = await Promise.all(uploadPromises);
      const validPaths = uploadedPaths.filter(
        (path) => path !== null,
      ) as string[];

      setFormData({
        ...formData,
        galleryImages: [...formData.galleryImages, ...validPaths],
      });
    } catch (error) {
      console.error("Error uploading gallery images:", error);
      alert("Failed to upload some images");
    } finally {
      setUploadingGallery(false);
    }
  }

  function removeGalleryImage(index: number) {
    const newGallery = [...formData.galleryImages];
    newGallery.splice(index, 1);
    setFormData({ ...formData, galleryImages: newGallery });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingId
        ? `/api/photography-services/${editingId}`
        : "/api/photography-services";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          features: formData.features
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean),
          price: formData.price ? parseFloat(formData.price) : null,
          order: parseInt(formData.order),
        }),
      });

      if (res.ok) {
        handleCancelEdit();
        fetchServices();
      }
    } catch (error) {
      console.error("Error saving service:", error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const res = await fetch(`/api/photography-services/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-5xl font-medium tracking-tight mb-2">
            Photography & Videography Services
          </h1>
          <p className="text-white/60">
            Manage your photography and videography service offerings
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200"
        >
          Add Service
        </button>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex items-start gap-6">
              {service.mainImage && (
                <img
                  src={service.mainImage}
                  alt={service.title}
                  className="w-48 h-32 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-medium">{service.title}</h3>
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      service.category === "PHOTOGRAPHY"
                        ? "bg-blue-500/20 text-blue-400"
                        : service.category === "VIDEOGRAPHY"
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {service.category}
                  </span>
                  {!service.isActive && (
                    <span className="px-3 py-1 text-xs rounded-full bg-red-500/20 text-red-400">
                      Inactive
                    </span>
                  )}
                </div>
                {service.description && (
                  <p className="text-white/60 mb-3">{service.description}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-white/40 mb-4">
                  {service.price && (
                    <div className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      ${service.price}
                    </div>
                  )}
                  {service.duration && (
                    <div className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {service.duration}
                    </div>
                  )}
                  <div className="flex items-center">
                    Gallery: {service.galleryImages.length} images
                  </div>
                  <div className="flex items-center">
                    Order: {service.order}
                  </div>
                </div>
                {service.features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white/10 text-white/60 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(service)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                >
                  <svg
                    className="h-5 w-5"
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
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-white/40 text-lg">
              No services yet. Click "Add Service" to create one.
            </p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-6">
            <div className="bg-black border border-white/20 rounded-2xl p-8 max-w-4xl w-full my-8">
              <h2 className="text-3xl font-medium mb-6">
                {editingId ? "Edit Service" : "Add New Service"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                      placeholder="e.g., Wedding Photography"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                    >
                      <option value="PHOTOGRAPHY">Photography</option>
                      <option value="VIDEOGRAPHY">Videography</option>
                      <option value="BOTH">Both</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) =>
                        setFormData({ ...formData, order: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Short Description
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                      placeholder="Brief description"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Full Details
                    </label>
                    <textarea
                      value={formData.details}
                      onChange={(e) =>
                        setFormData({ ...formData, details: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                      placeholder="Detailed description of the service"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                      placeholder="e.g., 2-3 hours"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Main Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      disabled={uploadingMain}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                    />
                    {uploadingMain && (
                      <p className="text-sm text-white/60 mt-2">Uploading...</p>
                    )}
                    {formData.mainImage && (
                      <div className="mt-4 relative inline-block">
                        <img
                          src={formData.mainImage}
                          alt="Main"
                          className="h-32 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, mainImage: "" })
                          }
                          className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600"
                        >
                          <svg
                            className="h-4 w-4"
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
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Gallery Images (Multiple)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImageUpload}
                      disabled={uploadingGallery}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                    />
                    {uploadingGallery && (
                      <p className="text-sm text-white/60 mt-2">Uploading...</p>
                    )}
                    {formData.galleryImages.length > 0 && (
                      <div className="mt-4 grid grid-cols-4 gap-4">
                        {formData.galleryImages.map((img, idx) => (
                          <div key={idx} className="relative">
                            <img
                              src={img}
                              alt={`Gallery ${idx + 1}`}
                              className="h-24 w-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(idx)}
                              className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600"
                            >
                              <svg
                                className="h-3 w-3"
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
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Features (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.features}
                      onChange={(e) =>
                        setFormData({ ...formData, features: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                      placeholder="Professional editing, High-res images, Online gallery"
                    />
                  </div>

                  <div className="col-span-2 flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isActive: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">Active</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 px-6 py-3 border border-white/20 rounded-full hover:bg-white/5 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200"
                  >
                    {editingId ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
