"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ContactSection from "@/components/contact-section";

interface RepairService {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  isActive: boolean;
}

export default function RepairPage() {
  const [services, setServices] = useState<RepairService[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    serviceId: "",
    issueDescription: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    setIsLoaded(true);
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

  function handleRequestService(serviceId: string) {
    setSelectedService(serviceId);
    setFormData({ ...formData, serviceId });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const res = await fetch("/api/repair-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitMessage(
          "Repair request submitted successfully! We'll contact you within 24 hours.",
        );
        setFormData({
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          serviceId: "",
          issueDescription: "",
        });
        setShowForm(false);
        setSelectedService("");
      } else {
        setSubmitMessage("Failed to submit request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting repair request:", error);
      setSubmitMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-medium tracking-tight"
            >
              <img
                src="/focus_house_icon.jpeg"
                alt="FocusHouse"
                className="h-8 w-8 rounded"
              />
              FocusHouse
            </Link>
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/photography"
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                Photography and Videography
              </Link>
              <div className="relative group">
                <Link
                  href="/accessories"
                  className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                >
                  Sewa Camera JB
                </Link>
                <div className="absolute top-full left-0 mt-2 w-48 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    href="/accessories?tab=combo"
                    className="block px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors duration-200"
                  >
                    Combo Package
                  </Link>
                  <Link
                    href="/accessories?tab=agreement"
                    className="block px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors duration-200"
                  >
                    Agreement
                  </Link>
                </div>
              </div>
              <Link
                href="/repair"
                className="text-sm text-white hover:text-white transition-colors duration-200"
              >
                Repair
              </Link>
              <Link
                href="/contact"
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2940)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black" />
        </div>

        <div
          className={`relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h1 className="text-6xl md:text-8xl font-medium tracking-tight mb-6 leading-tight">
            Camera Repair
            <br />
            <span className="text-white/40">Services</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto font-light">
            Professional repair services for cameras, lenses, and photography
            equipment. Expert technicians you can trust.
          </p>
        </div>
      </section>

      {/* Submit Message */}
      {submitMessage && (
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-8">
          <div
            className={`p-4 rounded-lg border ${
              submitMessage.includes("success")
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {submitMessage}
          </div>
        </div>
      )}

      {/* Repair Request Form */}
      {showForm && (
        <section className="py-16 px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-medium">Request Repair Service</h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedService("");
                  }}
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
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder:text-white/20"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      Email *
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
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      Phone *
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
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Service Type *
                  </label>
                  <select
                    required
                    value={formData.serviceId}
                    onChange={(e) =>
                      setFormData({ ...formData, serviceId: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white"
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} - ${service.basePrice} (base price)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Describe the Issue *
                  </label>
                  <textarea
                    required
                    value={formData.issueDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        issueDescription: e.target.value,
                      })
                    }
                    rows={5}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder:text-white/20 resize-none"
                    placeholder="Please describe the problem with your equipment in detail..."
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedService("");
                    }}
                    className="px-8 py-3 border border-white/20 rounded-full font-medium hover:bg-white/5 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Services Grid */}
      <section className="py-16 px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">
              Available Repair Services
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto font-light">
              Select a service to request a repair. Our team will provide a
              detailed quote after assessment.
            </p>
          </div>

          {services.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/40 text-lg">
                No repair services available at the moment. Please check back
                soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className={`group relative bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-[1.02] ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                      <svg
                        className="w-6 h-6 text-white/60"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-medium mb-2">
                      {service.name}
                    </h3>
                    {service.description && (
                      <p className="text-white/60 text-sm line-clamp-3">
                        {service.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-end justify-between pt-6 border-t border-white/10">
                    <div>
                      <div className="text-sm text-white/40 mb-1">
                        Starting at
                      </div>
                      <div className="text-3xl font-medium">
                        ${service.basePrice}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRequestService(service.id)}
                      className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200 text-sm"
                    >
                      Request Service
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <ContactSection />

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-2xl font-medium tracking-tight">
              FocusHouse
            </div>
            <div className="text-white/40 text-sm">
              © 2026 FocusHouse Photography. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
