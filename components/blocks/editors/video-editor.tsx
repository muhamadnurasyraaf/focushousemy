"use client";

import { useState } from "react";
import { VideoBlockData } from "@/lib/blocks";

interface VideoEditorProps {
  data: VideoBlockData;
  onChange: (data: VideoBlockData) => void;
}

export function VideoEditor({ data, onChange }: VideoEditorProps) {
  const [uploading, setUploading] = useState(false);

  function update(partial: Partial<VideoBlockData>) {
    onChange({ ...data, ...partial });
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/photography-video", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        update({ url: result.path });
      } else {
        alert(result.error || "Failed to upload video");
      }
    } catch {
      alert("Failed to upload video");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Upload Video</label>
        <input
          type="file"
          accept="video/mp4,video/quicktime,video/webm,video/x-msvideo,video/mpeg"
          onChange={handleUpload}
          disabled={uploading}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 text-sm"
        />
        {uploading && (
          <p className="text-sm text-white/60 mt-2">Uploading video...</p>
        )}
      </div>

      {/* Preview */}
      {data.url && (
        <div className="relative">
          <video
            src={data.url}
            controls
            className="w-full rounded-lg max-h-64 object-contain bg-black"
          />
          <button
            type="button"
            onClick={() => update({ url: "" })}
            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-2">Title (optional)</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => update({ title: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 text-sm"
          placeholder="e.g., Behind the Scenes"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">Description (optional)</label>
        <textarea
          value={data.description}
          onChange={(e) => update({ description: e.target.value })}
          rows={2}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 text-sm"
          placeholder="Short description..."
        />
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6">
        {(
          [
            { key: "autoplay", label: "Autoplay" },
            { key: "loop", label: "Loop" },
            { key: "muted", label: "Muted" },
          ] as { key: keyof VideoBlockData; label: string }[]
        ).map(({ key, label }) => (
          <label key={key} className="flex items-center gap-3 cursor-pointer">
            <div
              className={`relative w-10 h-6 rounded-full transition-colors ${data[key] ? "bg-white" : "bg-white/20"}`}
              onClick={() => update({ [key]: !data[key] } as Partial<VideoBlockData>)}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                  data[key] ? "left-5 bg-black" : "left-1 bg-white/60"
                }`}
              />
            </div>
            <span className="text-sm font-medium">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
