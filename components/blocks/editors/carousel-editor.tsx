"use client";

import { useRef, useState } from "react";
import { CarouselBlockData, CarouselImage } from "@/lib/blocks";

interface CarouselEditorProps {
  data: CarouselBlockData;
  onChange: (data: CarouselBlockData) => void;
}

export function CarouselEditor({ data, onChange }: CarouselEditorProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function update(partial: Partial<CarouselBlockData>) {
    onChange({ ...data, ...partial });
  }

  function updateImage(index: number, partial: Partial<CarouselImage>) {
    const images = [...data.images];
    images[index] = { ...images[index], ...partial };
    update({ images });
  }

  function removeImage(index: number) {
    update({ images: data.images.filter((_, i) => i !== index) });
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploads = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload/photography-image", {
          method: "POST",
          body: formData,
        });
        const result = await res.json();
        return res.ok ? result.path : null;
      });

      const results = await Promise.all(uploads);
      const newImages: CarouselImage[] = results
        .filter((p): p is string => p !== null)
        .map((src) => ({ src, caption: "" }));

      update({ images: [...data.images, ...newImages] });
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Carousel Images</label>
        <div className="space-y-3">
          {data.images.map((img, i) => (
            <div key={i} className="flex gap-3 items-start bg-white/5 p-3 rounded-lg">
              <img src={img.src} alt="" className="h-20 w-20 object-cover rounded-lg flex-shrink-0" />
              <div className="flex-1">
                <input
                  type="text"
                  value={img.caption}
                  onChange={(e) => updateImage(i, { caption: e.target.value })}
                  placeholder="Image caption..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-white/30"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors flex-shrink-0"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="mt-3 w-full py-3 border-2 border-dashed border-white/20 rounded-lg text-white/40 text-sm hover:border-white/40 transition-colors disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "+ Add Carousel Images"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className={`relative w-10 h-6 rounded-full transition-colors ${data.autoScroll ? "bg-white" : "bg-white/20"}`}
              onClick={() => update({ autoScroll: !data.autoScroll })}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                  data.autoScroll ? "left-5 bg-black" : "left-1 bg-white/60"
                }`}
              />
            </div>
            <span className="text-sm font-medium">Auto-scroll</span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Interval (seconds)</label>
          <input
            type="number"
            min={1}
            max={30}
            value={data.interval}
            onChange={(e) => update({ interval: Number(e.target.value) })}
            disabled={!data.autoScroll}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 disabled:opacity-40"
          />
        </div>
      </div>
    </div>
  );
}
