"use client";

import { HeroBlockData } from "@/lib/blocks";
import { ImageUpload } from "../image-upload";

interface HeroEditorProps {
  data: HeroBlockData;
  onChange: (data: HeroBlockData) => void;
}

export function HeroEditor({ data, onChange }: HeroEditorProps) {
  function update(partial: Partial<HeroBlockData>) {
    onChange({ ...data, ...partial });
  }

  return (
    <div className="space-y-4">
      <ImageUpload
        label="Background Image"
        value={data.backgroundImage}
        onChange={(v) => update({ backgroundImage: v })}
      />
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => update({ title: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
          placeholder="Hero title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Subtitle</label>
        <textarea
          value={data.subtitle}
          onChange={(e) => update({ subtitle: e.target.value })}
          rows={2}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
          placeholder="Hero subtitle"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">CTA Button Text</label>
          <input
            type="text"
            value={data.ctaText}
            onChange={(e) => update({ ctaText: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
            placeholder="Learn More"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">CTA Link</label>
          <input
            type="text"
            value={data.ctaLink}
            onChange={(e) => update({ ctaLink: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
            placeholder="#contact"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">
          Overlay Opacity: {data.overlayOpacity}%
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={data.overlayOpacity}
          onChange={(e) => update({ overlayOpacity: Number(e.target.value) })}
          className="w-full accent-white"
        />
      </div>
    </div>
  );
}
