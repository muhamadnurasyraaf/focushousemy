"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Block,
  HeroBlockData,
  ImageTextBlockData,
  CarouselBlockData,
  GalleryBlockData,
  FullWidthBannerBlockData,
} from "@/lib/blocks";

// ── Hero Block ──────────────────────────────────────────────────────────

function HeroBlock({ data }: { data: HeroBlockData }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {data.backgroundImage ? (
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${data.backgroundImage})` }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: `rgba(0,0,0,${data.overlayOpacity / 100})`,
            }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
      )}
      <div
        className={`relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center transition-all duration-1000 ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h1 className="text-6xl md:text-8xl font-medium tracking-tight mb-6 leading-tight">
          {data.title}
        </h1>
        {data.subtitle && (
          <p className="text-xl md:text-2xl text-white/60 mb-12 max-w-3xl mx-auto font-light">
            {data.subtitle}
          </p>
        )}
        {data.ctaText && (
          <a
            href={data.ctaLink || "#"}
            className="inline-block px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200 text-lg"
          >
            {data.ctaText}
          </a>
        )}
      </div>
    </section>
  );
}

// ── Image + Text Block ──────────────────────────────────────────────────

function ImageTextBlock({ data }: { data: ImageTextBlockData }) {
  const bgClass =
    data.backgroundColor === "dark"
      ? "bg-white/5"
      : data.backgroundColor === "darker"
        ? "bg-white/[0.02]"
        : "";
  const paddingClass =
    data.paddingSize === "small"
      ? "py-12"
      : data.paddingSize === "large"
        ? "py-24"
        : "py-16";

  const imageEl = data.image ? (
    <img
      src={data.image}
      alt={data.title}
      className="w-full h-96 object-cover rounded-2xl"
    />
  ) : null;

  const textEl = (
    <div>
      <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">
        {data.title}
      </h2>
      {data.description && (
        <p className="text-xl text-white/60 whitespace-pre-line">
          {data.description}
        </p>
      )}
    </div>
  );

  return (
    <section className={`${bgClass} ${paddingClass} px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {data.imagePosition === "left" ? (
          <>
            <div>{imageEl}</div>
            {textEl}
          </>
        ) : (
          <>
            {textEl}
            <div>{imageEl}</div>
          </>
        )}
      </div>
    </section>
  );
}

// ── Carousel Block ──────────────────────────────────────────────────────

function CarouselBlock({ data }: { data: CarouselBlockData }) {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = data.images.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (data.autoScroll && count > 1) {
      intervalRef.current = setInterval(next, data.interval * 1000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [data.autoScroll, data.interval, count, next]);

  if (count === 0) return null;

  return (
    <section className="py-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative">
        <div className="overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {data.images.map((img, i) => (
              <div key={i} className="w-full flex-shrink-0">
                <img
                  src={img.src}
                  alt={img.caption}
                  className="w-full h-[60vh] object-cover"
                />
                {img.caption && (
                  <p className="text-center text-white/40 mt-4 text-sm">
                    {img.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
        {count > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute top-1/2 left-4 -translate-y-1/2 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute top-1/2 right-4 -translate-y-1/2 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <div className="flex justify-center gap-2 mt-4">
              {data.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === current ? "bg-white" : "bg-white/20"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// ── Gallery Block ───────────────────────────────────────────────────────

function GalleryBlock({ data }: { data: GalleryBlockData }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (data.images.length === 0) return null;

  const colClass =
    data.columns === 2
      ? "md:grid-cols-2"
      : data.columns === 4
        ? "md:grid-cols-2 lg:grid-cols-4"
        : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="py-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 ${colClass} gap-4`}>
          {data.images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className={`w-full h-64 object-cover rounded-2xl hover:scale-[1.02] transition-transform duration-300 ${
                data.lightbox ? "cursor-pointer" : ""
              }`}
              onClick={() => data.lightbox && setLightboxIndex(i)}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {data.lightbox && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-6 right-6 p-2 text-white/60 hover:text-white"
            onClick={() => setLightboxIndex(null)}
          >
            <svg
              className="h-8 w-8"
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
          {lightboxIndex > 0 && (
            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex - 1);
              }}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          {lightboxIndex < data.images.length - 1 && (
            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex + 1);
              }}
            >
              <svg
                className="h-6 w-6"
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
            </button>
          )}
          <img
            src={data.images[lightboxIndex]}
            alt=""
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}

// ── Full-Width Banner Block ─────────────────────────────────────────────

function FullWidthBannerBlock({ data }: { data: FullWidthBannerBlockData }) {
  return (
    <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
      {data.backgroundImage ? (
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${data.backgroundImage})` }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: `rgba(0,0,0,${data.overlayOpacity / 100})`,
            }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 to-neutral-800" />
      )}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-4">
          {data.title}
        </h2>
        {data.subtitle && (
          <p className="text-xl text-white/60 mb-8">{data.subtitle}</p>
        )}
        {data.ctaText && (
          <a
            href={data.ctaLink || "#"}
            className="inline-block px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200 text-lg"
          >
            {data.ctaText}
          </a>
        )}
      </div>
    </section>
  );
}

// ── Block Renderer ──────────────────────────────────────────────────────

function RenderBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "hero":
      return <HeroBlock data={block.data as HeroBlockData} />;
    case "image-text":
      return <ImageTextBlock data={block.data as ImageTextBlockData} />;
    case "carousel":
      return <CarouselBlock data={block.data as CarouselBlockData} />;
    case "gallery":
      return <GalleryBlock data={block.data as GalleryBlockData} />;
    case "full-width-banner":
      return (
        <FullWidthBannerBlock data={block.data as FullWidthBannerBlockData} />
      );
    default:
      return null;
  }
}

// ── Fallback Home Page (shown when no CMS blocks exist) ─────────────────

const DEFAULT_CONTACT = "60176754462";

function FallbackHome() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [heroBackgroundImage, setHeroBackgroundImage] = useState<string>(
    "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=2940",
  );
  const [contactNumber, setContactNumber] = useState(DEFAULT_CONTACT);

  useEffect(() => {
    requestAnimationFrame(() => setIsLoaded(true));

    (async () => {
      try {
        const res = await fetch("/api/site-config");
        const data = await res.json();
        if (data.heroBackgroundImage) {
          setHeroBackgroundImage(data.heroBackgroundImage);
        }
        if (data.contactNumber) {
          setContactNumber(data.contactNumber);
        }
      } catch (error) {
        console.error("Error fetching site config:", error);
      }
    })();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${heroBackgroundImage})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
        </div>

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
            <button
              onClick={() => {
                document
                  .getElementById("our_services")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200 text-lg"
            >
              Browse Package
            </button>
            <a
              href={`https://wa.me/${contactNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-white/20 rounded-full font-medium hover:bg-white hover:text-black transition-all duration-200 text-lg"
            >
              Contact Us
            </a>
          </div>
        </div>

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
      <section
        id="our_services"
        className="py-32 px-6 lg:px-8 border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-5xl md:text-6xl font-medium tracking-tight mb-6">
              Our Services
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto font-light">
              Everything you need for your photography journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              href="/photography"
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
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-medium mb-4">
                Photography & Videography
              </h3>
              <p className="text-white/60 mb-6">
                Professional photography and videography services for
                graduations, events, portraits, and more.
              </p>
              <div className="flex items-center text-white/80 group-hover:text-white transition-colors">
                <span className="mr-2">View Packages</span>
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
            Let&apos;s Create Together
          </h2>
          <p className="text-xl text-white/60 mb-12 font-light">
            Have questions or special requests? We&apos;d love to hear from you
            and help with your photography needs.
          </p>
          <a
            href={`https://wa.me/${contactNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200 text-lg"
          >
            Contact Us on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}

// ── Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [useCMS, setUseCMS] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/pages/home");
        const data = await res.json();
        if (Array.isArray(data.blocks) && data.blocks.length > 0) {
          setBlocks(
            data.blocks.sort((a: Block, b: Block) => a.order - b.order),
          );
          setUseCMS(true);
        }
      } catch (err) {
        console.error("Failed to load page:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
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
                className="text-sm text-white hover:text-white transition-colors duration-200"
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
                  Sewa Camera Jb
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

      {/* Content */}
      {useCMS ? (
        <div className="pt-20">
          {blocks.map((block) => (
            <RenderBlock key={block.id} block={block} />
          ))}
        </div>
      ) : (
        <FallbackHome />
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-2xl font-medium tracking-tight">
              FocusHouse
            </div>
            <div className="text-white/40 text-sm">
              &copy; 2026 FocusHouse. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
