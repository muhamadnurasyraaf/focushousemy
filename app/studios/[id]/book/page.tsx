"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Studio {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  pricePerHour: number;
  pricingType: "PER_HOUR" | "PER_DAY";
  bookings: {
    startTime: string;
    endTime: string;
  }[];
}

export default function BookSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchStudio();
  }, [id]);

  async function fetchStudio() {
    try {
      const res = await fetch(`/api/studios/${id}`);
      const data = await res.json();
      setStudio(data);
    } catch (error) {
      console.error("Error fetching package:", error);
    }
  }

  function calculatePrice() {
    if (!formData.startDate || !formData.startTime || !studio) {
      return 0;
    }

    const start = new Date(`${formData.startDate}T${formData.startTime}`);

    // If no end time specified, assume full day (8 hours for hourly, 1 day for daily)
    let end: Date;
    if (formData.endDate && formData.endTime) {
      end = new Date(`${formData.endDate}T${formData.endTime}`);
    } else {
      end = new Date(start);
      if (studio.pricingType === "PER_DAY") {
        end.setDate(end.getDate() + 1); // Add 1 day
      } else {
        end.setHours(end.getHours() + 8); // Add 8 hours
      }
    }

    if (studio.pricingType === "PER_DAY") {
      const days = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
      );
      return days > 0 ? (days * Number(studio.pricePerHour)).toFixed(2) : 0;
    } else {
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return hours > 0 ? (hours * Number(studio.pricePerHour)).toFixed(2) : 0;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const startDateTime = new Date(
        `${formData.startDate}T${formData.startTime}`,
      );

      // If no end time specified, assume full day
      let endDateTime: Date;
      if (formData.endDate && formData.endTime) {
        endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

        if (endDateTime <= startDateTime) {
          setError("End time must be after start time");
          setLoading(false);
          return;
        }
      } else {
        endDateTime = new Date(startDateTime);
        if (studio?.pricingType === "PER_DAY") {
          endDateTime.setDate(endDateTime.getDate() + 1); // Add 1 day
        } else {
          endDateTime.setHours(endDateTime.getHours() + 8); // Add 8 hours
        }
      }

      const totalPrice = calculatePrice();

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studioId: id,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          totalPrice,
          notes: formData.notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to book session");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      console.error("Error booking session:", error);
      setError("Failed to book session");
    } finally {
      setLoading(false);
    }
  }

  if (!studio) {
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
          <h2 className="text-3xl font-medium mb-4">Session Booked!</h2>
          <p className="text-white/60 mb-8">
            Your photography session request has been submitted. Our
            photographer will review and confirm your booking shortly. You'll
            receive an email notification.
          </p>
          <p className="text-sm text-white/40">Redirecting to home...</p>
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
              href="/"
              className="text-sm text-white/60 hover:text-white transition-colors duration-200"
            >
              ← Back to Packages
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Package Info */}
          <div className="mb-12">
            <h1 className="text-5xl font-medium tracking-tight mb-4">
              Book Your Session
            </h1>
            <div className="text-2xl text-white/60 mb-2">{studio.name}</div>
            {studio.description && (
              <p className="text-lg text-white/40">{studio.description}</p>
            )}
          </div>

          {/* Booking Form */}
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
                      Phone Number
                    </label>
                    <input
                      type="tel"
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

              {/* Session Schedule */}
              <div>
                <h3 className="text-xl font-medium mb-6">
                  Preferred Session Schedule
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/60">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          startDate: e.target.value,
                          endDate: e.target.value,
                        })
                      }
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/60">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.startTime}
                      onChange={(e) =>
                        setFormData({ ...formData, startTime: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-white/60">
                      Expected Duration (End Time)(Optional)
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) =>
                        setFormData({ ...formData, endTime: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white"
                    />
                    <p className="mt-2 text-xs text-white/40">
                      {studio?.pricingType === "PER_DAY"
                        ? "Leave empty to book for a full day (24 hours)"
                        : "Leave empty to book for 8 hours"}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-white/60">
                      Special Requests or Details
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder:text-white/20 resize-none"
                      placeholder="Tell us about your vision, number of people, preferred style, props needed, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <div className="text-white/60 text-sm mb-1">
                      Estimated Session Cost
                    </div>
                    <div className="text-xs text-white/40">
                      Pricing: ${studio.pricePerHour}{" "}
                      {studio.pricingType === "PER_HOUR"
                        ? "per hour"
                        : "per day"}
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
                  {loading ? "Submitting Request..." : "Request Booking"}
                </button>

                <p className="mt-4 text-sm text-white/40 text-center">
                  Our photographer will review and confirm your session. You'll
                  receive an email notification with booking details.
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
