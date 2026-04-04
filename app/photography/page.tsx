"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import ContactSection from "@/components/contact-section";
import {
  Block,
  HeroBlockData,
  ImageTextBlockData,
  CarouselBlockData,
  GalleryBlockData,
  FullWidthBannerBlockData,
  VideoBlockData,
  TextMediaBlockData,
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

// ── Video Block ─────────────────────────────────────────────────────────

function VideoBlock({ data }: { data: VideoBlockData }) {
  if (!data.url) return null;

  return (
    <section className="py-16 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {data.title && (
          <h2 className="text-4xl font-medium tracking-tight mb-4 text-center">
            {data.title}
          </h2>
        )}
        {data.description && (
          <p className="text-white/60 text-center mb-8 text-lg">
            {data.description}
          </p>
        )}
        <video
          src={data.url}
          controls
          autoPlay={data.autoplay}
          loop={data.loop}
          muted={data.muted}
          playsInline
          className="w-full rounded-2xl bg-black"
        />
      </div>
    </section>
  );
}

// ── Text + Media Block ───────────────────────────────────────────────────

function TextMediaBlock({ data }: { data: TextMediaBlockData }) {
  const mediaEl =
    data.mediaType === "video" && data.mediaUrl ? (
      <video
        src={data.mediaUrl}
        controls
        autoPlay={data.autoplay}
        loop={data.loop}
        muted={data.muted}
        playsInline
        className="w-full rounded-2xl bg-black"
      />
    ) : data.mediaUrl ? (
      <img
        src={data.mediaUrl}
        alt={data.topTitle}
        className="w-full h-full object-cover rounded-2xl"
      />
    ) : null;

  return (
    <section className="py-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {(data.topTitle || data.topDescription) && (
          <div className="mb-10">
            {data.topTitle && (
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">
                {data.topTitle}
              </h2>
            )}
            {data.topDescription && (
              <p className="text-xl text-white/60">{data.topDescription}</p>
            )}
          </div>
        )}
        {mediaEl && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>{mediaEl}</div>
            {data.sideText && (
              <p className="text-lg text-white/70 leading-relaxed whitespace-pre-line">
                {data.sideText}
              </p>
            )}
          </div>
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
    case "video":
      return <VideoBlock data={block.data as VideoBlockData} />;
    case "text-media":
      return <TextMediaBlock data={block.data as TextMediaBlockData} />;
    default:
      return null;
  }
}

// ── Page ────────────────────────────────────────────────────────────────

const DEFAULT_CONTACT = "60176754462";

export default function PhotographyPublicPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactNumber, setContactNumber] = useState(DEFAULT_CONTACT);

  useEffect(() => {
    async function load() {
      try {
        const [pageRes, configRes] = await Promise.all([
          fetch("/api/pages/photography"),
          fetch("/api/site-config"),
        ]);
        const data = await pageRes.json();
        if (data.isDraft === false && Array.isArray(data.blocks)) {
          setBlocks(
            data.blocks.sort((a: Block, b: Block) => a.order - b.order),
          );
        } else if (Array.isArray(data.blocks) && data.blocks.length > 0) {
          // Show content even if draft (for now, since there's no published version system)
          setBlocks(
            data.blocks.sort((a: Block, b: Block) => a.order - b.order),
          );
        }
        const configData = await configRes.json();
        if (configData.contactNumber) {
          setContactNumber(configData.contactNumber);
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
      <Navbar />

      {/* Blocks */}
      <div className="pt-20">
        {blocks.map((block) => (
          <RenderBlock key={block.id} block={block} />
        ))}

        {blocks.length === 0 && (
          <section className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-5xl font-medium tracking-tight mb-4">
                Photography & Videography
              </h1>
              <p className="text-white/40 text-lg">
                Content coming soon. Check back later!
              </p>
            </div>
          </section>
        )}
      </div>

      {/* Contact Section */}
      <ContactSection />

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
