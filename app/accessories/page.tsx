"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ContactSection from "@/components/contact-section";

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [contactNumber, setContactNumber] = useState("60176754462");

  useEffect(() => {
    setIsLoaded(true);
    fetchAccessories();
    fetch("/api/site-config")
      .then((res) => res.json())
      .then((data) => {
        if (data.contactNumber) setContactNumber(data.contactNumber);
      })
      .catch(() => {});
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

  const categories = [
    "all",
    ...new Set(
      accessories.map((a) => a.category).filter((c): c is string => c !== null),
    ),
  ];

  const filteredAccessories =
    selectedCategory === "all"
      ? accessories
      : accessories.filter((a) => a.category === selectedCategory);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="text-2xl font-medium tracking-tight">
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
                  className="text-sm text-white hover:text-white transition-colors duration-200"
                >
                  Sewa Camera Jb
                </Link>
                <div className="absolute top-full left-0 mt-2 w-48 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    href="/accessories"
                    className="block px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors duration-200"
                  >
                    Combo Package
                  </Link>
                  <Link
                    href="/agreement"
                    className="block px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors duration-200"
                  >
                    Agreement
                  </Link>
                </div>
              </div>
              <Link
                href="/repair"
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
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
                "url(https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=2940)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
        </div>

        <div
          className={`relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h1 className="text-6xl md:text-8xl font-medium tracking-tight mb-6 leading-tight">
            Rent Professional
            <br />
            <span className="text-white/40">Camera Gear</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto font-light">
            Access high-quality cameras, lenses, lighting, and accessories for
            your photography needs.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      {categories.length > 1 && (
        <section className="py-8 px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-white text-black"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  {category === "all"
                    ? "All Items"
                    : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Accessories Grid */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredAccessories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/40 text-lg">
                No accessories available at the moment. Please check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAccessories.map((accessory, index) => (
                <div
                  key={accessory.id}
                  className={`group relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-[1.02] ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Accessory Image */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-white/10 to-white/5 relative overflow-hidden">
                    {accessory.images.length > 0 ? (
                      <img
                        src={accessory.images[0]}
                        alt={accessory.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-white/20"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-medium mb-1">
                        {accessory.name}
                      </h3>
                    </div>
                  </div>

                  {/* Accessory Details */}
                  <div className="p-6">
                    {accessory.description && (
                      <p className="text-white/60 mb-4 line-clamp-2">
                        {accessory.description}
                      </p>
                    )}

                    <div className="space-y-2 mb-4 text-sm">
                      {accessory.category && (
                        <div className="flex items-center text-white/40">
                          <svg
                            className="h-4 w-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                          {accessory.category}
                        </div>
                      )}

                      <div className="flex items-center text-white/40">
                        <svg
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                        {accessory.quantity} available
                      </div>
                    </div>

                    <div className="flex items-end justify-between pt-4 border-t border-white/10">
                      <div>
                        <div className="text-3xl font-medium">
                          ${accessory.pricePerDay}
                        </div>
                        <div className="text-white/40 text-sm">per day</div>
                      </div>

                      <Link
                        href={`/accessories/${accessory.id}/rent`}
                        className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200 text-sm"
                      >
                        Rent Now
                      </Link>
                    </div>
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
