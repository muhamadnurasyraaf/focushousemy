"use client";

import { ImageTextBlockData } from "@/lib/blocks";
import { ImageUpload } from "../image-upload";

interface ImageTextEditorProps {
  data: ImageTextBlockData;
  onChange: (data: ImageTextBlockData) => void;
}

export function ImageTextEditor({ data, onChange }: ImageTextEditorProps) {
  function update(partial: Partial<ImageTextBlockData>) {
    onChange({ ...data, ...partial });
  }

  return (
    <div className="space-y-4">
      <ImageUpload
        label="Image"
        value={data.image}
        onChange={(v) => update({ image: v })}
      />
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => update({ title: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
          placeholder="Section title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => update({ description: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
          placeholder="Section description..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Image Position</label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => update({ imagePosition: "left" })}
            className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors ${
              data.imagePosition === "left"
                ? "bg-white text-black border-white"
                : "border-white/10 text-white/60 hover:border-white/30"
            }`}
          >
            Image Left
          </button>
          <button
            type="button"
            onClick={() => update({ imagePosition: "right" })}
            className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors ${
              data.imagePosition === "right"
                ? "bg-white text-black border-white"
                : "border-white/10 text-white/60 hover:border-white/30"
            }`}
          >
            Image Right
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Background Color</label>
          <select
            value={data.backgroundColor}
            onChange={(e) => update({ backgroundColor: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
          >
            <option value="transparent">Transparent</option>
            <option value="black">Black</option>
            <option value="dark">Dark Gray</option>
            <option value="darker">Darker</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Padding</label>
          <select
            value={data.paddingSize}
            onChange={(e) => update({ paddingSize: e.target.value as "small" | "medium" | "large" })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>
    </div>
  );
}
