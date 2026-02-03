"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Accessory {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  quantity: number;
  pricePerDay: number;
  images: string[];
}

export default function RentAccessoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [accessory, setAccessory] = useState<Accessory | null>(null);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    startDate: "",
    endDate: "",
    quantity: "1",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchAccessory();
  }, [id]);

  async function fetchAccessory() {
    try {
      const res = await fetch(`/api/accessories/${id}`);
      const data = await res.json();
      setAccessory(data);
    } catch (error) {
      console.error("Error fetching accessory:", error);
    }
  }

  function calculatePrice() {
    if (!formData.startDate || !formData.endDate || !accessory) {
      return 0;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    return days > 0
      ? (days * Number(accessory.pricePerDay) * parseInt(formData.quantity)).toFixed(2)
      : 0;
  }

  function getDays() {
    if (!formData.startDate || !formData.endDate) {
      return 0;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    return Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (endDate <= startDate) {
        setError("End date must be after start date");
        setLoading(false);
        return;
      }

      if (parseInt(formData.quantity) > (accessory?.quantity || 0)) {
        setError(
          `Only ${accessory?.quantity} units available. Please reduce quantity.`
        );
        setLoading(false);
        return;
      }

      const res = await fetch("/api/accessory-rentals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessoryId: id,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          quantity: formData.quantity,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to book rental");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/accessories");
      }, 3000);
    } catch (error) {
      console.error("Error booking rental:", error);
      setError("Failed to book rental");
    } finally {
      setLoading(false);
    }
  }

  if (!accessory) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/40">Loading...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-medium mb-4">Rental Booked!</h2>
          <p className="text-white/60 mb-8">
            Your accessory rental request has been submitted. We'll review your
            booking and send you confirmation details via email.
          </p>
          <p className="text-sm text-white/40">
            Redirecting to accessories page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="text-2xl font-medium tracking-tight">
              FocusHouse
            </Link>
            <Link
              href="/accessories"
              className="text-sm text-white/60 hover:text-white transition-colors duration-200"
            >
              ← Back to Accessories
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Accessory Info */}
          <div className="mb-12">
            <h1 className="text-5xl font-medium tracking-tight mb-4">
              Rent Equipment
            </h1>
            <div className="text-2xl text-white/60 mb-2">{accessory.name}</div>
            {accessory.description && (
              <p className="text-lg text-white/40">{accessory.description}</p>
            )}
            <div className="mt-4 flex items-center gap-4 text-sm text-white/40">
              {accessory.category && (
                <span className="px-3 py-1 bg-white/10 rounded-full">
                  {accessory.category}
                </span>
              )}
              <span>{accessory.quantity} units available</span>
            </div>
          </div>

          {/* Rental Form */}
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div>
                <h3 className="text-xl font-medium mb-6">Your Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-white/60">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder:text-white/20"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/60">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerEmail: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder:text-white/20"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/60">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.customerPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerPhone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder:text-white/20"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>

              {/* Rental Details */}
              <div>
                <h3 className="text-xl font-medium mb-6">Rental Period</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/60">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          startDate: e.target.value,
                        })
                      }
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/60">
                      End Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      min={formData.startDate || new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-white/60">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={accessory.quantity}
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder:text-white/20"
                      placeholder="1"
                    />
                    <p className="mt-2 text-xs text-white/40">
                      Maximum {accessory.quantity} units available
                    </p>
                  </div>

                  {getDays() > 0 && (
                    <div className="sm:col-span-2 p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-sm text-white/60">
                        Rental Duration: <span className="text-white font-medium">{getDays()} day{getDays() !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Summary */}
              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <div className="text-white/60 text-sm mb-1">
                      Total Rental Cost
                    </div>
                    <div className="text-xs text-white/40">
                      ${accessory.pricePerDay}/day × {formData.quantity} unit
                      {parseInt(formData.quantity) !== 1 ? "s" : ""} × {getDays()} day
                      {getDays() !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <span className="text-4xl font-medium">
                    ${calculatePrice()}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting Request..." : "Request Rental"}
                </button>

                <p className="mt-4 text-sm text-white/40 text-center">
                  We'll review your rental request and send you confirmation
                  details via email.
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
