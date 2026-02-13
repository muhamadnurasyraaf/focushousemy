"use client";

import { useEffect, useState } from "react";

export default function ContactSection() {
  const [contactNumber, setContactNumber] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/site-config")
      .then((res) => res.json())
      .then((data) => {
        if (data.contactNumber) setContactNumber(data.contactNumber);
      })
      .catch(() => {});
  }, []);

  return (
    <section
      id="contact"
      className="py-32 px-6 lg:px-8 border-t border-white/10"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-5xl md:text-6xl font-medium tracking-tight mb-6">
          Get in Touch
        </h2>
        <p className="text-xl text-white/60 mb-12 font-light">
          Have questions or special requests? We&apos;d love to hear from you.
        </p>
        <a
          href={contactNumber ? `https://wa.me/${contactNumber}` : "#"}
          target={contactNumber ? "_blank" : undefined}
          rel={contactNumber ? "noopener noreferrer" : undefined}
          onClick={contactNumber ? undefined : (e) => e.preventDefault()}
          className="inline-block px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200 text-lg"
        >
          Contact Us on WhatsApp
        </a>
      </div>
    </section>
  );
}
