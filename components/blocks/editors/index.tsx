"use client";

import {
  Block,
  BlockData,
  HeroBlockData,
  ImageTextBlockData,
  CarouselBlockData,
  GalleryBlockData,
  FullWidthBannerBlockData,
} from "@/lib/blocks";
import { HeroEditor } from "./hero-editor";
import { ImageTextEditor } from "./image-text-editor";
import { CarouselEditor } from "./carousel-editor";
import { GalleryEditor } from "./gallery-editor";
import { FullWidthBannerEditor } from "./full-width-banner-editor";

interface BlockEditorProps {
  block: Block;
  onChange: (data: BlockData) => void;
}

export function BlockEditor({ block, onChange }: BlockEditorProps) {
  switch (block.type) {
    case "hero":
      return (
        <HeroEditor
          data={block.data as HeroBlockData}
          onChange={onChange}
        />
      );
    case "image-text":
      return (
        <ImageTextEditor
          data={block.data as ImageTextBlockData}
          onChange={onChange}
        />
      );
    case "carousel":
      return (
        <CarouselEditor
          data={block.data as CarouselBlockData}
          onChange={onChange}
        />
      );
    case "gallery":
      return (
        <GalleryEditor
          data={block.data as GalleryBlockData}
          onChange={onChange}
        />
      );
    case "full-width-banner":
      return (
        <FullWidthBannerEditor
          data={block.data as FullWidthBannerBlockData}
          onChange={onChange}
        />
      );
    default:
      return <p className="text-white/40">Unknown block type</p>;
  }
}
