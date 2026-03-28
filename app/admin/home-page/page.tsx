"use client";

import { useEffect, useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Block,
  BlockType,
  BlockData,
  BLOCK_LABELS,
  BLOCK_DESCRIPTIONS,
  createDefaultBlockData,
  HeroBlockData,
  ImageTextBlockData,
  CarouselBlockData,
  GalleryBlockData,
  FullWidthBannerBlockData,
} from "@/lib/blocks";
import { BlockEditor } from "@/components/blocks/editors";

const PAGE_SLUG = "home";

function generateId() {
  return crypto.randomUUID();
}

// ── Sortable Block Wrapper ──────────────────────────────────────────────

function SortableBlock({
  block,
  onUpdate,
  onDelete,
  isExpanded,
  onToggle,
}: {
  block: Block;
  onUpdate: (data: BlockData) => void;
  onDelete: () => void;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        className={`bg-white/5 rounded-2xl border transition-colors ${
          isDragging ? "border-white/30" : "border-white/10"
        }`}
      >
        {/* Block Header */}
        <div className="flex items-center gap-3 px-6 py-4">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-white/30 hover:text-white/60 touch-none"
            title="Drag to reorder"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
            </svg>
          </button>

          <div className="flex-1 cursor-pointer select-none" onClick={onToggle}>
            <div className="flex items-center gap-3">
              <span className="text-xs px-2 py-1 bg-white/10 rounded-md text-white/60 uppercase tracking-wider">
                {BLOCK_LABELS[block.type]}
              </span>
              <span className="text-sm text-white/40">#{block.order + 1}</span>
            </div>
          </div>

          <button
            onClick={onToggle}
            className="p-2 text-white/40 hover:text-white transition-colors"
          >
            <svg
              className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <button
            onClick={onDelete}
            className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Delete block"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        {/* Block Editor (collapsed / expanded) */}
        {isExpanded && (
          <div className="px-6 pb-6 border-t border-white/5 pt-4">
            <BlockEditor block={block} onChange={onUpdate} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Block Type Selector Modal ──────────────────────────────────────────

function BlockTypeSelector({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (type: BlockType) => void;
}) {
  if (!open) return null;

  const types: BlockType[] = [
    "hero",
    "image-text",
    "carousel",
    "gallery",
    "full-width-banner",
  ];

  const icons: Record<BlockType, React.ReactNode> = {
    hero: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    "image-text": (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7"
        />
      </svg>
    ),
    carousel: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 4h10M7 20h10M4 8h16v8H4z"
        />
      </svg>
    ),
    gallery: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
    "full-width-banner": (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 5h16M4 19h16M4 9h16v6H4z"
        />
      </svg>
    ),
    video: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
        />
      </svg>
    ),
    "text-media": (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 6h16M4 10h16M4 14h7M4 18h7M13 13h7v6h-7z"
        />
      </svg>
    ),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-neutral-900 rounded-2xl border border-white/10 p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-medium">Add Block</h2>
          <button
            onClick={onClose}
            className="p-2 text-white/40 hover:text-white transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => {
                onSelect(type);
                onClose();
              }}
              className="text-left p-5 rounded-xl border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all group"
            >
              <div className="text-white/40 group-hover:text-white/70 mb-3 transition-colors">
                {icons[type]}
              </div>
              <h3 className="font-medium mb-1">{BLOCK_LABELS[type]}</h3>
              <p className="text-sm text-white/40">
                {BLOCK_DESCRIPTIONS[type]}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Preview Component ───────────────────────────────────────────────────

function BlockPreview({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-0">
      {blocks.map((block) => {
        switch (block.type) {
          case "hero": {
            const d = block.data as HeroBlockData;
            return (
              <div
                key={block.id}
                className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
              >
                {d.backgroundImage && (
                  <div className="absolute inset-0">
                    <img
                      src={d.backgroundImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: `rgba(0,0,0,${d.overlayOpacity / 100})`,
                      }}
                    />
                  </div>
                )}
                {!d.backgroundImage && (
                  <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 to-black" />
                )}
                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                  <h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-4">
                    {d.title}
                  </h1>
                  {d.subtitle && (
                    <p className="text-xl text-white/60 mb-8">{d.subtitle}</p>
                  )}
                  {d.ctaText && (
                    <span className="inline-block px-8 py-4 bg-white text-black rounded-full font-medium text-lg">
                      {d.ctaText}
                    </span>
                  )}
                </div>
              </div>
            );
          }
          case "image-text": {
            const d = block.data as ImageTextBlockData;
            const bg =
              d.backgroundColor === "dark"
                ? "bg-white/5"
                : d.backgroundColor === "darker"
                  ? "bg-white/[0.02]"
                  : "";
            const padding =
              d.paddingSize === "small"
                ? "py-12"
                : d.paddingSize === "large"
                  ? "py-24"
                  : "py-16";
            const imgFirst = d.imagePosition === "left";
            return (
              <div key={block.id} className={`${bg} ${padding} px-6 lg:px-8`}>
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {imgFirst && (
                    <div>
                      {d.image ? (
                        <img
                          src={d.image}
                          alt=""
                          className="w-full h-96 object-cover rounded-2xl"
                        />
                      ) : (
                        <div className="w-full h-96 bg-white/5 rounded-2xl flex items-center justify-center text-white/20">
                          No image
                        </div>
                      )}
                    </div>
                  )}
                  <div>
                    <h2 className="text-4xl font-medium tracking-tight mb-6">
                      {d.title}
                    </h2>
                    <p className="text-lg text-white/60 whitespace-pre-line">
                      {d.description}
                    </p>
                  </div>
                  {!imgFirst && (
                    <div>
                      {d.image ? (
                        <img
                          src={d.image}
                          alt=""
                          className="w-full h-96 object-cover rounded-2xl"
                        />
                      ) : (
                        <div className="w-full h-96 bg-white/5 rounded-2xl flex items-center justify-center text-white/20">
                          No image
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          }
          case "carousel": {
            const d = block.data as CarouselBlockData;
            return (
              <div key={block.id} className="py-16 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                  {d.images.length > 0 ? (
                    <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
                      {d.images.map((img, i) => (
                        <div
                          key={i}
                          className="flex-shrink-0 w-[80%] md:w-[45%] lg:w-[30%] snap-center"
                        >
                          <img
                            src={img.src}
                            alt={img.caption}
                            className="w-full h-72 object-cover rounded-2xl"
                          />
                          {img.caption && (
                            <p className="text-sm text-white/40 mt-2">
                              {img.caption}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-72 bg-white/5 rounded-2xl flex items-center justify-center text-white/20">
                      No carousel images
                    </div>
                  )}
                </div>
              </div>
            );
          }
          case "gallery": {
            const d = block.data as GalleryBlockData;
            const colClass =
              d.columns === 2
                ? "md:grid-cols-2"
                : d.columns === 4
                  ? "md:grid-cols-2 lg:grid-cols-4"
                  : "md:grid-cols-2 lg:grid-cols-3";
            return (
              <div key={block.id} className="py-16 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                  {d.images.length > 0 ? (
                    <div className={`grid grid-cols-1 ${colClass} gap-4`}>
                      {d.images.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt=""
                          className="w-full h-64 object-cover rounded-2xl"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="h-64 bg-white/5 rounded-2xl flex items-center justify-center text-white/20">
                      No gallery images
                    </div>
                  )}
                </div>
              </div>
            );
          }
          case "full-width-banner": {
            const d = block.data as FullWidthBannerBlockData;
            return (
              <div
                key={block.id}
                className="relative min-h-[50vh] flex items-center justify-center overflow-hidden"
              >
                {d.backgroundImage && (
                  <div className="absolute inset-0">
                    <img
                      src={d.backgroundImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: `rgba(0,0,0,${d.overlayOpacity / 100})`,
                      }}
                    />
                  </div>
                )}
                {!d.backgroundImage && (
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 to-neutral-800" />
                )}
                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                  <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-4">
                    {d.title}
                  </h2>
                  {d.subtitle && (
                    <p className="text-xl text-white/60 mb-8">{d.subtitle}</p>
                  )}
                  {d.ctaText && (
                    <span className="inline-block px-8 py-4 bg-white text-black rounded-full font-medium text-lg">
                      {d.ctaText}
                    </span>
                  )}
                </div>
              </div>
            );
          }
          default:
            return null;
        }
      })}
      {blocks.length === 0 && (
        <div className="py-32 text-center text-white/20">
          <p className="text-lg">
            No blocks added yet. Switch to Edit mode to start building your
            page.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main Editor Page ────────────────────────────────────────────────────

export default function HomePageEditor() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [isDraft, setIsDraft] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    fetchPage();
  }, []);

  async function fetchPage() {
    try {
      const res = await fetch(`/api/pages/${PAGE_SLUG}`);
      const data = await res.json();
      const loaded = Array.isArray(data.blocks) ? data.blocks : [];
      setBlocks(loaded.map((b: Block, i: number) => ({ ...b, order: i })));
      setIsDraft(data.isDraft ?? true);
    } catch (err) {
      console.error("Failed to load page:", err);
    } finally {
      setLoading(false);
    }
  }

  function showMessage(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setBlocks((prev) => {
      const oldIndex = prev.findIndex((b) => b.id === active.id);
      const newIndex = prev.findIndex((b) => b.id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);
      return reordered.map((b, i) => ({ ...b, order: i }));
    });
  }

  function addBlock(type: BlockType) {
    const newBlock: Block = {
      id: generateId(),
      type,
      order: blocks.length,
      data: createDefaultBlockData(type),
    };
    setBlocks((prev) => [...prev, newBlock]);
    setExpandedId(newBlock.id);
  }

  const updateBlock = useCallback((id: string, data: BlockData) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, data } : b)));
  }, []);

  function deleteBlock(id: string) {
    setBlocks((prev) =>
      prev.filter((b) => b.id !== id).map((b, i) => ({ ...b, order: i })),
    );
    if (expandedId === id) setExpandedId(null);
  }

  async function savePage(asDraft: boolean) {
    setSaving(true);
    try {
      const res = await fetch(`/api/pages/${PAGE_SLUG}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blocks: blocks.map((b, i) => ({ ...b, order: i })),
          isDraft: asDraft,
        }),
      });

      if (res.ok) {
        setIsDraft(asDraft);
        showMessage(asDraft ? "Draft saved!" : "Page published!");
      } else {
        showMessage("Failed to save");
      }
    } catch (err) {
      console.error("Save failed:", err);
      showMessage("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-white/5 rounded-lg w-1/2" />
          <div className="h-6 bg-white/5 rounded-lg w-1/3" />
          <div className="h-64 bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Top Toolbar */}
      <div className="sticky top-20 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setMode("edit")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === "edit"
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => setMode("preview")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === "preview"
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Preview
              </button>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-md ${isDraft ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}`}
            >
              {isDraft ? "Draft" : "Published"}
            </span>
            {message && (
              <span
                className={`text-sm ${message.includes("Failed") ? "text-red-400" : "text-green-400"}`}
              >
                {message}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              View Page
            </a>
            <button
              onClick={() => savePage(true)}
              disabled={saving}
              className="px-4 py-2 text-sm border border-white/20 rounded-full hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={() => savePage(false)}
              disabled={saving}
              className="px-5 py-2 text-sm bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Publish"}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Mode */}
      {mode === "preview" && (
        <div className="bg-black text-white">
          <BlockPreview blocks={blocks} />
        </div>
      )}

      {/* Edit Mode */}
      {mode === "edit" && (
        <div className="max-w-5xl mx-auto py-8 px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-medium tracking-tight mb-2">
              Home Page Builder
            </h1>
            <p className="text-white/40">
              Drag blocks to reorder. Click to expand and edit content.
            </p>
          </div>

          {/* Blocks List */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4 mb-6">
                {blocks.map((block) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    isExpanded={expandedId === block.id}
                    onToggle={() =>
                      setExpandedId(expandedId === block.id ? null : block.id)
                    }
                    onUpdate={(data) => updateBlock(block.id, data)}
                    onDelete={() => deleteBlock(block.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Add Block */}
          {blocks.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
              <svg
                className="h-12 w-12 mx-auto text-white/20 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-white/30 text-lg mb-4">
                Start building your home page
              </p>
              <button
                onClick={() => setSelectorOpen(true)}
                className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors"
              >
                Add Your First Block
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSelectorOpen(true)}
              className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-white/30 hover:text-white/60 hover:border-white/20 transition-colors flex items-center justify-center gap-2"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Block
            </button>
          )}
        </div>
      )}

      {/* Block Type Selector Modal */}
      <BlockTypeSelector
        open={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onSelect={addBlock}
      />
    </div>
  );
}
