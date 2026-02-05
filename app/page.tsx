"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SiteConfig {
  id: string;
  heroBackgroundImage: string | null;
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [heroBackgroundImage, setHeroBackgroundImage] = useState<string>(
    "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=2940",
  );

  useEffect(() => {
    setIsLoaded(true);
    fetchSiteConfig();
  }, []);

  async function fetchSiteConfig() {
    try {
      const res = await fetch("/api/site-config");
      const data: SiteConfig = await res.json();
      if (data.heroBackgroundImage) {
        setHeroBackgroundImage(data.heroBackgroundImage);
      }
    } catch (error) {
      console.error("Error fetching site config:", error);
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
                href="/photography"
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                Photography & Videography
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
              backgroundImage: `url(${heroBackgroundImage})`,
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
            Professional photography services, camera accessories, and expert
            repair services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/accessories"
              className="px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200 text-lg"
            >
              Browse Accessories
            </Link>
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

      {/* Services Section */}
      <section className="py-32 px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-5xl md:text-6xl font-medium tracking-tight mb-6">
              Our Services
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto font-light">
              Everything you need for your photography journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Accessories Card */}
            <Link
              href="/accessories"
              className="group bg-white/5 rounded-2xl p-12 border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-[1.02]"
            >
              <div className="flex items-center mb-6">
                <div className="p-4 bg-white/10 rounded-xl">
                  <svg
                    className="h-8 w-8 text-white"
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
              </div>
              <h3 className="text-3xl font-medium mb-4">
                Camera & Accessories
              </h3>
              <p className="text-white/60 mb-6">
                Rent professional cameras, lenses, lighting equipment, and
                accessories for your photography needs.
              </p>
              <div className="flex items-center text-white/80 group-hover:text-white transition-colors">
                <span className="mr-2">Browse Rentals</span>
                <svg
                  className="h-5 w-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>

            {/* Repair Services Card */}
            <Link
              href="/repair"
              className="group bg-white/5 rounded-2xl p-12 border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-[1.02]"
            >
              <div className="flex items-center mb-6">
                <div className="p-4 bg-white/10 rounded-xl">
                  <svg
                    className="h-8 w-8 text-white"
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
              </div>
              <h3 className="text-3xl font-medium mb-4">Repair Services</h3>
              <p className="text-white/60 mb-6">
                Expert repair and maintenance services for your camera equipment
                and accessories.
              </p>
              <div className="flex items-center text-white/80 group-hover:text-white transition-colors">
                <span className="mr-2">View Services</span>
                <svg
                  className="h-5 w-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          </div>
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
            Have questions or special requests? We'd love to hear from you and
            help with your photography needs.
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
              © 2026 FocusHouse. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
