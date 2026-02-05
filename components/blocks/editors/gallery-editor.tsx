"use client";

import { GalleryBlockData } from "@/lib/blocks";
import { MultiImageUpload } from "../image-upload";

interface GalleryEditorProps {
  data: GalleryBlockData;
  onChange: (data: GalleryBlockData) => void;
}

export function GalleryEditor({ data, onChange }: GalleryEditorProps) {
  function update(partial: Partial<GalleryBlockData>) {
    onChange({ ...data, ...partial });
  }

  return (
    <div className="space-y-4">
      <MultiImageUpload
        label="Gallery Images"
        values={data.images}
        onChange={(images) => update({ images })}
      />
      <div>
        <label className="block text-sm font-medium mb-2">Grid Columns</label>
        <div className="flex gap-3">
          {([2, 3, 4] as const).map((col) => (
            <button
              key={col}
              type="button"
              onClick={() => update({ columns: col })}
              className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors ${
                data.columns === col
                  ? "bg-white text-black border-white"
                  : "border-white/10 text-white/60 hover:border-white/30"
              }`}
            >
              {col} Columns
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            className={`relative w-10 h-6 rounded-full transition-colors ${data.lightbox ? "bg-white" : "bg-white/20"}`}
            onClick={() => update({ lightbox: !data.lightbox })}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                data.lightbox ? "left-5 bg-black" : "left-1 bg-white/60"
              }`}
            />
          </div>
          <span className="text-sm font-medium">Enable Lightbox</span>
        </label>
      </div>
    </div>
  );
}
