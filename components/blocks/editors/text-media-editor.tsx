"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { TextMediaBlockData } from "@/lib/blocks";
import { MultiImageUpload } from "../image-upload";

interface TextMediaEditorProps {
  data: TextMediaBlockData;
  onChange: (data: TextMediaBlockData) => void;
}

export function TextMediaEditor({ data, onChange }: TextMediaEditorProps) {
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);

  function update(partial: Partial<TextMediaBlockData>) {
    onChange({ ...data, ...partial });
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    const uploadToast = toast.loading(`Uploading ${file.name}...`);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/photography-video", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (res.ok) {
        update({ mediaUrls: [result.path] });
        toast.success("Video uploaded successfully", { id: uploadToast });
      } else {
        toast.error(result.error || "Failed to upload video", { id: uploadToast });
      }
    } catch {
      toast.error("Upload failed. Please try again.", { id: uploadToast });
    } finally {
      setUploadingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  }

  const videoUrl = data.mediaUrls?.[0] ?? "";

  return (
    <div className="space-y-5">
      {/* Top section */}
      <div className="pb-4 border-b border-white/10">
        <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Top Text</p>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={data.topTitle}
              onChange={(e) => update({ topTitle: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 text-sm"
              placeholder="Section title..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={data.topDescription}
              onChange={(e) => update({ topDescription: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 text-sm"
              placeholder="Optional description below title..."
            />
          </div>
        </div>
      </div>

      {/* Media type toggle */}
      <div>
        <label className="block text-sm font-medium mb-2">Media Type (Left Side)</label>
        <div className="flex gap-3">
          {(["image", "video"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => update({ mediaType: type, mediaUrls: [] })}
              className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors capitalize ${
                data.mediaType === type
                  ? "bg-white text-black border-white"
                  : "border-white/10 text-white/60 hover:border-white/30"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Media upload */}
      {data.mediaType === "image" ? (
        <MultiImageUpload
          label="Images (Left Side — multiple allowed)"
          values={data.mediaUrls ?? []}
          onChange={(urls) => update({ mediaUrls: urls })}
        />
      ) : (
        <div>
          <label className="block text-sm font-medium mb-2">Video (Left)</label>
          {videoUrl ? (
            <div className="relative">
              <video
                src={videoUrl}
                controls
                className="w-full rounded-lg max-h-48 object-contain bg-black"
              />
              <button
                type="button"
                onClick={() => update({ mediaUrls: [] })}
                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              disabled={uploadingVideo}
              className="w-full h-32 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center hover:border-white/40 transition-colors disabled:opacity-50"
            >
              {uploadingVideo ? (
                <span className="text-white/40 text-sm">Uploading...</span>
              ) : (
                <div className="text-center">
                  <svg className="h-8 w-8 mx-auto text-white/30 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                  </svg>
                  <span className="text-white/40 text-sm">Click to upload video</span>
                </div>
              )}
            </button>
          )}
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm,video/x-msvideo,video/mpeg"
            onChange={handleVideoUpload}
            className="hidden"
          />

          {/* Video options */}
          {videoUrl && (
            <div className="flex flex-wrap gap-4 mt-3">
              {(
                [
                  { key: "autoplay", label: "Autoplay" },
                  { key: "loop", label: "Loop" },
                  { key: "muted", label: "Muted" },
                ] as { key: keyof TextMediaBlockData; label: string }[]
              ).map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <div
                    className={`relative w-8 h-5 rounded-full transition-colors ${data[key] ? "bg-white" : "bg-white/20"}`}
                    onClick={() => update({ [key]: !data[key] } as Partial<TextMediaBlockData>)}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${data[key] ? "left-3.5 bg-black" : "left-0.5 bg-white/60"}`} />
                  </div>
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Right side text */}
      <div>
        <label className="block text-sm font-medium mb-2">Text (Right Side)</label>
        <textarea
          value={data.sideText}
          onChange={(e) => update({ sideText: e.target.value })}
          rows={5}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 text-sm"
          placeholder="Text displayed beside the media..."
        />
      </div>
    </div>
  );
}
