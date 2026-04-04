"use client";

import { useEffect, useState } from "react";

interface SiteConfig {
  id: string;
  heroBackgroundImage: string | null;
  contactNumber: string | null;
  instagram: string | null;
  instagramCatalogue: string | null;
  facebook: string | null;
  address: string | null;
}

export default function SettingsPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [contactNumber, setContactNumber] = useState("");
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [instagram, setInstagram] = useState("");
  const [instagramCatalogue, setInstagramCatalogue] = useState("");
  const [facebook, setFacebook] = useState("");
  const [address, setAddress] = useState("");
  const [isSavingSocial, setIsSavingSocial] = useState(false);
  const [socialMessage, setSocialMessage] = useState("");
  const [tapCount, setTapCount] = useState(0);
  const [showSeed, setShowSeed] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState("");

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    try {
      const res = await fetch("/api/site-config");
      const data = await res.json();
      setConfig(data);
      if (data.contactNumber) {
        setContactNumber(data.contactNumber);
      }
      if (data.instagram) {
        setInstagram(data.instagram);
      }
      if (data.instagramCatalogue) {
        setInstagramCatalogue(data.instagramCatalogue);
      }
      if (data.facebook) {
        setFacebook(data.facebook);
      }
      if (data.address) {
        setAddress(data.address);
      }
    } catch (error) {
      console.error("Error fetching config:", error);
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

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8">
      <h1
        className="text-5xl font-medium tracking-tight mb-4 select-none"
        onClick={() => {
          const next = tapCount + 1;
          setTapCount(next);
          if (next >= 5) {
            setShowSeed(true);
            setTapCount(0);
          }
        }}
      >
        Site Settings
      </h1>
      <p className="text-white/60 mb-12">
        Configure your website appearance and settings
      </p>

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

      {/* Social Media & Address Section */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setIsSavingSocial(true);
          setSocialMessage("");
          try {
            const res = await fetch("/api/site-config", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                instagram: instagram || null,
                instagramCatalogue: instagramCatalogue || null,
                facebook: facebook || null,
                address: address || null,
              }),
            });
            if (res.ok) {
              const data = await res.json();
              setConfig(data);
              setSocialMessage("Social media & address saved!");
              setTimeout(() => setSocialMessage(""), 3000);
            } else {
              setSocialMessage("Failed to save settings");
            }
          } catch (error) {
            console.error("Error saving social settings:", error);
            setSocialMessage("Failed to save settings");
          } finally {
            setIsSavingSocial(false);
          }
        }}
        className="mt-8 space-y-8"
      >
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-medium mb-2">Social Media & Address</h2>
          <p className="text-white/60 text-sm mb-6">
            Configure your social media links and business address shown in the
            Contact section across the site.
          </p>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="instagram"
                className="block text-sm font-medium mb-2"
              >
                Instagram URL
              </label>
              <input
                type="text"
                id="instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://www.instagram.com/yourusername"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="instagramCatalogue"
                className="block text-sm font-medium mb-2"
              >
                Instagram Catalogue URL{" "}
                <span className="text-white/40 font-normal">(Photography & Videography page)</span>
              </label>
              <input
                type="text"
                id="instagramCatalogue"
                value={instagramCatalogue}
                onChange={(e) => setInstagramCatalogue(e.target.value)}
                placeholder="https://www.instagram.com/yourcatalogue"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="facebook"
                className="block text-sm font-medium mb-2"
              >
                Facebook URL
              </label>
              <input
                type="text"
                id="facebook"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://www.facebook.com/yourpage"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium mb-2"
              >
                Business Address
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main Street, Johor Bahru, Johor, Malaysia"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
              <p className="text-white/40 text-xs mt-2">
                This will be linked to Google Maps automatically.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {socialMessage && (
              <span
                className={`text-sm ${socialMessage.includes("saved") ? "text-green-400" : "text-red-400"}`}
              >
                {socialMessage}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={isSavingSocial}
            className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSavingSocial ? "Saving..." : "Save Social & Address"}
          </button>
        </div>
      </form>

      {/* Hidden Seed Section */}
      {showSeed && (
        <div className="mt-8 bg-red-500/5 rounded-2xl p-8 border border-red-500/20">
          <h2 className="text-2xl font-medium mb-2 text-red-400">
            Database Seed
          </h2>
          <p className="text-white/60 text-sm mb-6">
            Seeds the database with the default admin user
            (admin@focushouse.com).
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              disabled={isSeeding}
              onClick={async () => {
                setIsSeeding(true);
                setSeedMessage("");
                try {
                  const res = await fetch("/api/seed", { method: "POST" });
                  const data = await res.json();
                  if (res.ok) {
                    setSeedMessage(`Seed completed: ${data.email}`);
                  } else {
                    setSeedMessage(data.error || "Seed failed");
                  }
                } catch {
                  setSeedMessage("Failed to run seed");
                } finally {
                  setIsSeeding(false);
                }
              }}
              className="px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full font-medium hover:bg-red-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSeeding ? "Seeding..." : "Run Seed"}
            </button>
            <button
              type="button"
              onClick={() => setShowSeed(false)}
              className="px-6 py-3 border border-white/10 text-white/60 rounded-full hover:bg-white/5 transition-all duration-200"
            >
              Hide
            </button>
            {seedMessage && (
              <span
                className={`text-sm ${seedMessage.includes("completed") ? "text-green-400" : "text-red-400"}`}
              >
                {seedMessage}
              </span>
            )}
          </div>
        </div>
      )}

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
