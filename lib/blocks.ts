export type BlockType =
  | "hero"
  | "image-text"
  | "carousel"
  | "gallery"
  | "full-width-banner"
  | "video"
  | "text-media";

export interface HeroBlockData {
  backgroundImage: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  overlayOpacity: number;
}

export interface ImageTextBlockData {
  image: string;
  title: string;
  description: string;
  imagePosition: "left" | "right";
  backgroundColor: string;
  paddingSize: "small" | "medium" | "large";
}

export interface CarouselImage {
  src: string;
  caption: string;
}

export interface CarouselBlockData {
  images: CarouselImage[];
  autoScroll: boolean;
  interval: number;
}

export interface GalleryBlockData {
  images: string[];
  columns: 2 | 3 | 4;
  lightbox: boolean;
}

export interface FullWidthBannerBlockData {
  backgroundImage: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  overlayOpacity: number;
}

export interface VideoBlockData {
  url: string;
  title: string;
  description: string;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
}

export interface TextMediaBlockData {
  topTitle: string;
  topDescription: string;
  mediaType: "image" | "video";
  mediaUrls: string[];
  sideText: string;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
}

export type BlockData =
  | HeroBlockData
  | ImageTextBlockData
  | CarouselBlockData
  | GalleryBlockData
  | FullWidthBannerBlockData
  | VideoBlockData
  | TextMediaBlockData;

export interface Block {
  id: string;
  type: BlockType;
  order: number;
  data: BlockData;
}

export const BLOCK_LABELS: Record<BlockType, string> = {
  hero: "Hero Banner",
  "image-text": "Image + Text Split",
  carousel: "Carousel / Slider",
  gallery: "Gallery Grid",
  "full-width-banner": "Full-Width Banner",
  video: "Video",
  "text-media": "Text + Media Split",
};

export const BLOCK_DESCRIPTIONS: Record<BlockType, string> = {
  hero: "Large hero banner with background image, title, and call-to-action",
  "image-text": "Side-by-side image and text content",
  carousel: "Scrolling image carousel with captions",
  gallery: "Grid of images with optional lightbox",
  "full-width-banner": "Full-width banner with overlay text and CTA",
  video: "Embed a video with optional title and description",
  "text-media": "Text on top, image or video on the left with text on the right",
};

export function createDefaultBlockData(type: BlockType): BlockData {
  switch (type) {
    case "hero":
      return {
        backgroundImage: "",
        title: "Your Title Here",
        subtitle: "Your subtitle goes here",
        ctaText: "Learn More",
        ctaLink: "#",
        overlayOpacity: 60,
      };
    case "image-text":
      return {
        image: "",
        title: "Section Title",
        description: "Add your description here...",
        imagePosition: "left",
        backgroundColor: "transparent",
        paddingSize: "medium",
      };
    case "carousel":
      return {
        images: [],
        autoScroll: true,
        interval: 5,
      };
    case "gallery":
      return {
        images: [],
        columns: 3,
        lightbox: true,
      };
    case "full-width-banner":
      return {
        backgroundImage: "",
        title: "Banner Title",
        subtitle: "Banner subtitle text",
        ctaText: "Get Started",
        ctaLink: "#",
        overlayOpacity: 50,
      };
    case "video":
      return {
        url: "",
        title: "",
        description: "",
        autoplay: false,
        loop: false,
        muted: true,
      };
    case "text-media":
      return {
        topTitle: "",
        topDescription: "",
        mediaType: "image" as const,
        mediaUrls: [],
        sideText: "",
        autoplay: false,
        loop: false,
        muted: true,
      };
  }
}
