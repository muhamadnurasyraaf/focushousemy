"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Studio {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  capacity: number | null;
  pricePerHour: number;
  pricingType: "PER_HOUR" | "PER_DAY";
  amenities: string[];
}

export default function Home() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
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
                href="#packages"
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                Packages
              </Link>
              <Link
                href="/accessories"
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                Accessories
              </Link>
              <Link
                href="/repair"
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                Repairs
              </Link>
              <a
                href="#contact"
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=2940)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
        </div>

        {/* Hero Content */}
        <div
          className={`relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h1 className="text-6xl md:text-8xl font-medium tracking-tight mb-6 leading-tight">
            Capture Your
            <br />
            <span className="text-white/40">Perfect Moment</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto font-light">
            Professional photography sessions for graduations, families,
            portraits, and special moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#packages"
              className="px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200 text-lg"
            >
              View Packages
            </a>
            <a
              href="https://wa.me/60176754462"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-white/20 rounded-full font-medium hover:bg-white hover:text-black transition-all duration-200 text-lg"
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Photography Packages Section */}
      <section
        id="packages"
        className="py-32 px-6 lg:px-8 border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-5xl md:text-6xl font-medium tracking-tight mb-6">
              Photography Packages
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto font-light">
              Choose the perfect package for your special occasion. Each session
              includes professional editing and digital delivery.
            </p>
          </div>

          {studios.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/40 text-lg">
                No packages available at the moment. Please check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {studios.map((studio, index) => (
                <div
                  key={studio.id}
                  className={`group relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-[1.02] ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Package Image Placeholder */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-white/10 to-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-medium mb-1">
                        {studio.name}
                      </h3>
                    </div>
                  </div>

                  {/* Package Details */}
                  <div className="p-6">
                    {studio.description && (
                      <p className="text-white/60 mb-4 line-clamp-2">
                        {studio.description}
                      </p>
                    )}

                    <div className="space-y-2 mb-4 text-sm">
                      {studio.location && (
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
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {studio.location}
                        </div>
                      )}

                      {studio.capacity && (
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
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                          Up to {studio.capacity} people
                        </div>
                      )}
                    </div>

                    {studio.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {studio.amenities.slice(0, 3).map((amenity, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-white/10 text-white/60 text-xs rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                        {studio.amenities.length > 3 && (
                          <span className="px-3 py-1 bg-white/10 text-white/60 text-xs rounded-full">
                            +{studio.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-end justify-between pt-4 border-t border-white/10">
                      <div>
                        <div className="text-3xl font-medium">
                          ${studio.pricePerHour}
                        </div>
                        <div className="text-white/40 text-sm">
                          {studio.pricingType === "PER_HOUR"
                            ? "per hour"
                            : "per day"}
                        </div>
                      </div>

                      <Link
                        href={`/studios/${studio.id}/book`}
                        className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200 text-sm"
                      >
                        Book Session
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-32 px-6 lg:px-8 border-t border-white/10"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-medium tracking-tight mb-6">
            Let's Create Together
          </h2>
          <p className="text-xl text-white/60 mb-12 font-light">
            Have questions or special requests? We'd love to hear about your
            vision and help capture your special moments.
          </p>
          <a
            href="https://wa.me/60176754462"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200 text-lg"
          >
            Get in Touch
          </a>
        </div>
      </section>

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
