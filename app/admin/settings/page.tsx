"use client";

import { useEffect, useState } from "react";

interface SiteConfig {
  id: string;
  heroBackgroundImage: string | null;
  contactNumber: string | null;
}

export default function SettingsPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [contactMessage, setContactMessage] = useState("");

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    try {
      const res = await fetch("/api/site-config");
      const data = await res.json();
      setConfig(data);
      if (data.heroBackgroundImage) {
        setPreviewUrl(data.heroBackgroundImage);
      }
      if (data.contactNumber) {
        setContactNumber(data.contactNumber);
      }
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setMessage("Invalid file type. Only JPEG, PNG, and WebP are allowed");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage("File size too large. Maximum size is 5MB");
      return;
    }

    setImageFile(file);
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setMessage("");
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();

    if (!imageFile) {
      setMessage("Please select an image to upload");
      return;
    }

    setIsUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const res = await fetch("/api/upload/hero-background", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setConfig(data.config);
        setPreviewUrl(data.path);
        setImageFile(null);
        setMessage("Image uploaded successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleRemove() {
    setIsUploading(true);
    setMessage("");

    try {
      const res = await fetch("/api/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroBackgroundImage: null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setConfig(data);
        setPreviewUrl("");
        setImageFile(null);
        setMessage("Background image removed");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to remove image");
      }
    } catch (error) {
      console.error("Error removing image:", error);
      setMessage("Failed to remove image");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSaveContact(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingContact(true);
    setContactMessage("");

    try {
      const res = await fetch("/api/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactNumber: contactNumber || null }),
      });

      if (res.ok) {
        const data = await res.json();
        setConfig(data);
        setContactMessage("Contact number saved!");
        setTimeout(() => setContactMessage(""), 3000);
      } else {
        setContactMessage("Failed to save contact number");
      }
    } catch (error) {
      console.error("Error saving contact number:", error);
      setContactMessage("Failed to save contact number");
    } finally {
      setIsSavingContact(false);
    }
  }

  const defaultImage =
    "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=2940";
  const displayImage = previewUrl || defaultImage;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8">
      <h1 className="text-5xl font-medium tracking-tight mb-4">
        Site Settings
      </h1>
      <p className="text-white/60 mb-12">
        Configure your website appearance and settings
      </p>

      <form onSubmit={handleUpload} className="space-y-8">
        {/* Hero Background Image Section */}
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-medium mb-2">Hero Background Image</h2>
          <p className="text-white/60 text-sm mb-6">
            Upload a custom background image for the main page hero section.
            Image will be saved to your server.
          </p>

          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <label
                htmlFor="imageFile"
                className="block text-sm font-medium mb-2"
              >
                Upload Image
              </label>
              <div className="flex items-center gap-4">
                <label htmlFor="imageFile" className="flex-1 cursor-pointer">
                  <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors flex items-center justify-between">
                    <span className="text-white/60 text-sm">
                      {imageFile
                        ? imageFile.name
                        : "Choose an image file (JPEG, PNG, WebP)"}
                    </span>
                    <svg
                      className="h-5 w-5 text-white/40"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <input
                    type="file"
                    id="imageFile"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-white/40 text-xs mt-2">
                Recommended: High-resolution image (1920x1080 or larger), Max
                size: 5MB
              </p>
            </div>

            {/* Image Preview */}
            <div>
              <label className="block text-sm font-medium mb-2">Preview</label>
              <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${displayImage})`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
                <div className="relative z-10 flex items-center justify-center h-full">
                  <div className="text-center">
                    <h3 className="text-3xl font-medium mb-2">
                      Capture Your
                      <br />
                      <span className="text-white/40">Perfect Moment</span>
                    </h3>
                    <p className="text-white/60">Hero section preview</p>
                  </div>
                </div>
              </div>
              {!previewUrl && (
                <p className="text-white/40 text-xs mt-2">
                  Currently showing default fallback image
                </p>
              )}
              {config?.heroBackgroundImage && (
                <p className="text-white/40 text-xs mt-2">
                  Current: {config.heroBackgroundImage}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div>
            {message && (
              <span
                className={`text-sm ${message.includes("success") || message.includes("removed") ? "text-green-400" : "text-red-400"}`}
              >
                {message}
              </span>
            )}
          </div>
          <div className="flex gap-4">
            {config?.heroBackgroundImage && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className="px-6 py-3 border border-red-500/20 text-red-400 rounded-full hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove Image
              </button>
            )}
            <button
              type="submit"
              disabled={isUploading || !imageFile}
              className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : "Upload Image"}
            </button>
          </div>
        </div>
      </form>

      {/* Contact Number Section */}
      <form onSubmit={handleSaveContact} className="mt-8 space-y-8">
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-medium mb-2">WhatsApp Contact Number</h2>
          <p className="text-white/60 text-sm mb-6">
            Set the WhatsApp contact number used across the site for "Contact
            Us" links. Include country code without + sign (e.g. 60176754462).
          </p>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="contactNumber"
                className="block text-sm font-medium mb-2"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="contactNumber"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="60176754462"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
              <p className="text-white/40 text-xs mt-2">
                This number will be used for all WhatsApp links on the website.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {contactMessage && (
              <span
                className={`text-sm ${contactMessage.includes("saved") ? "text-green-400" : "text-red-400"}`}
              >
                {contactMessage}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={isSavingContact}
            className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSavingContact ? "Saving..." : "Save Contact Number"}
          </button>
        </div>
      </form>

      {/* Tips Section */}
      <div className="mt-12 bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-medium mb-3">Tips for Best Results</h3>
        <ul className="space-y-2 text-white/60 text-sm">
          <li className="flex items-start">
            <svg
              className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Upload high-resolution images (1920x1080 or larger) for better
            quality on large screens
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Choose images with enough contrast for white text to be readable
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Supported formats: JPEG, PNG, WebP with maximum file size of 5MB
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            The image will have a dark gradient overlay for better text
            visibility
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Images are saved to public/uploads and will persist after deployment
          </li>
        </ul>
      </div>
    </div>
  );
}
