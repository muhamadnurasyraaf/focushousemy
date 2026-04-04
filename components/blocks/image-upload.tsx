"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const VALID_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function validateImageFile(file: File): string | null {
  if (!VALID_TYPES.includes(file.type)) {
    return "Invalid file type. Only JPEG, PNG, and WebP are allowed.";
  }
  if (file.size > MAX_SIZE) {
    return `File "${file.name}" is too large. Maximum size is 10MB.`;
  }
  return null;
}

interface ImageUploadProps {
  value: string;
  onChange: (path: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      toast.error(error);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setUploading(true);
    const uploadToast = toast.loading(`Uploading ${file.name}...`);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/photography-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        onChange(data.path);
        toast.success("Image uploaded successfully", { id: uploadToast });
      } else {
        toast.error(data.error || "Failed to upload image", { id: uploadToast });
      }
    } catch {
      toast.error("Upload failed. Please try again.", { id: uploadToast });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-2">{label}</label>
      )}
      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt=""
            className="h-32 rounded-lg object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-32 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center hover:border-white/40 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <span className="text-white/40 text-sm">Uploading...</span>
          ) : (
            <div className="text-center">
              <svg className="h-8 w-8 mx-auto text-white/30 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-white/40 text-sm">Click to upload</span>
            </div>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}

interface MultiImageUploadProps {
  values: string[];
  onChange: (paths: string[]) => void;
  label?: string;
}

export function MultiImageUpload({ values, onChange, label }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Client-side validation for all files first
    for (const file of fileArray) {
      const error = validateImageFile(file);
      if (error) {
        toast.error(error);
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
    }

    setUploading(true);
    const uploadToast = toast.loading(`Uploading ${fileArray.length} image${fileArray.length > 1 ? "s" : ""}...`);
    try {
      const uploads = fileArray.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload/photography-image", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Failed to upload ${file.name}`);
        return data.path as string;
      });

      const results = await Promise.allSettled(uploads);
      const succeeded = results
        .filter((r): r is PromiseFulfilledResult<string> => r.status === "fulfilled")
        .map((r) => r.value);
      const failed = results.filter((r) => r.status === "rejected").length;

      onChange([...values, ...succeeded]);

      if (failed > 0) {
        toast.warning(`${succeeded.length} uploaded, ${failed} failed.`, { id: uploadToast });
      } else {
        toast.success(`${succeeded.length} image${succeeded.length > 1 ? "s" : ""} uploaded`, { id: uploadToast });
      }
    } catch {
      toast.error("Upload failed. Please try again.", { id: uploadToast });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-2">{label}</label>
      )}
      <div className="grid grid-cols-4 gap-3 mb-3">
        {values.map((src, i) => (
          <div key={i} className="relative">
            <img
              src={src}
              alt=""
              className="h-24 w-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full py-3 border-2 border-dashed border-white/20 rounded-lg text-white/40 text-sm hover:border-white/40 transition-colors disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "+ Add Images"}
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
  );
}
