"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ContactSection from "@/components/contact-section";

const agreementSections = [
  {
    title: "1. Definisi (Definitions)",
    content: [
      '"Pemberi Sewa" merujuk kepada FocusHouse / Sewa Camera JB.',
      '"Penyewa" merujuk kepada individu yang menyewa peralatan daripada Pemberi Sewa.',
      '"Peralatan" merujuk kepada kamera, lensa, aksesori, dan lain-lain peralatan yang disewa bersama seperti yang dinyatakan dalam Jadual 1.',
      '"Deposit" merujuk kepada jumlah wang yang dibayar sebagai cagaran seperti yang dinyatakan dalam Jadual 2.',
      '"Jumlah Sewaan" merujuk kepada jumlah keseluruhan bayaran sewaan seperti yang dinyatakan dalam Jadual 2.',
      '"Tempoh Sewaan" merujuk kepada tempoh masa sewaan peralatan seperti yang dinyatakan dalam Jadual 1.',
    ],
  },
  {
    title: "2. Representasi Penyewa (Renter Representations)",
    content: [
      "2.1 Penyewa mengesahkan bahawa beliau bukan seorang bankrap dan mempunyai keupayaan undang-undang untuk memasuki perjanjian ini.",
      "2.2 Penyewa bertanggungjawab sepenuhnya ke atas keselamatan dan keadaan peralatan sepanjang tempoh sewaan.",
      "2.3 Penyewa tidak boleh mendedahkan peralatan kepada sebarang keadaan yang boleh menjejaskan kualiti atau fungsi peralatan.",
    ],
  },
  {
    title: "3. Pembayaran (Payment)",
    content: [
      "3.1 Pada masa menandatangani perjanjian ini, Penyewa hendaklah membayar jumlah keseluruhan seperti yang dinyatakan dalam Jadual 2 pada tarikh perjanjian.",
      "3.2 Dengan menandatangani perjanjian ini, Penyewa mengakui telah memeriksa peralatan dan menerimanya dalam keadaan selamat, berfungsi dengan baik, dan tanpa sebarang kerosakan.",
    ],
  },
  {
    title: "4. Pemulangan Peralatan (Return of Equipment)",
    content: [
      "4.1 Apabila tamat tempoh sewaan, Penyewa hendaklah memulangkan peralatan dalam keadaan selamat dan berfungsi dengan baik kepada Pemberi Sewa.",
      "4.2 Setelah Pemberi Sewa menerima semula peralatan dan berpuas hati bahawa peralatan berada dalam keadaan asal dan baik, deposit akan dikembalikan kepada Penyewa.",
    ],
  },
  {
    title: "5. Kerosakan atau Kehilangan (Damage or Loss)",
    content: [
      "5.1 Sekiranya peralatan dipulangkan dalam keadaan rosak, hilang, atau tidak berfungsi dengan baik, Penyewa bertanggungjawab untuk membayar ganti rugi kepada Pemberi Sewa bagi kos penggantian dan/atau pembaikan sepenuhnya.",
    ],
  },
  {
    title: "6. Caj Pemulangan Lewat (Late Return Charges)",
    content: [
      "6.1 Sekiranya Penyewa gagal memulangkan peralatan pada masa yang ditetapkan, caj pemulangan lewat akan dikenakan.",
      "6.2 Kelewatan melebihi 12 jam akan dikenakan caj bersamaan dengan satu hari penuh sewaan.",
      "6.3 Caj ini akan terus dikenakan bagi setiap hari berikutnya sehingga peralatan dipulangkan.",
    ],
  },
  {
    title: "7. Kemungkiran Penyewa (Default by Renter)",
    content: [
      "7.1 Sekiranya Penyewa gagal, enggan, atau cuai untuk membayar mana-mana bahagian daripada jumlah keseluruhan, Pemberi Sewa berhak untuk menuntut sewaan tertunggak, caj lewat, dan mengambil tindakan undang-undang yang sewajarnya bagi mendapatkan semula kerugian.",
    ],
  },
  {
    title: "8. Larangan Penyewaan Semula (Subletting Prohibited)",
    content: [
      "8.1 Penyewa tidak dibenarkan memindah milik hak sewaan atau menyewakan semula peralatan kepada pihak ketiga tanpa kebenaran bertulis daripada Pemberi Sewa.",
    ],
  },
  {
    title: "9. Pemulangan Awal (Early Return Policy)",
    content: [
      "9.1 Sekiranya peralatan dipulangkan sebelum tamat tempoh sewaan, tiada bayaran balik akan diberikan bagi tempoh yang tidak digunakan, melainkan kedua-dua pihak bersetuju sebaliknya.",
    ],
  },
];

export default function AgreementPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-medium tracking-tight"
            >
              <img
                src="/focus_house_icon.jpeg"
                alt="FocusHouse"
                className="h-8 w-8 rounded"
              />
              FocusHouse
            </Link>
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/photography"
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                Photography and Videography
              </Link>
              <div className="relative group">
                <Link
                  href="/accessories"
                  className="text-sm text-white hover:text-white transition-colors duration-200"
                >
                  Sewa Camera JB
                </Link>
                <div className="absolute top-full left-0 mt-2 w-48 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    href="/accessories?tab=combo"
                    className="block px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors duration-200"
                  >
                    Combo Package
                  </Link>
                  <Link
                    href="/accessories?tab=agreement"
                    className="block px-4 py-2 text-sm text-white hover:text-white hover:bg-white/5 transition-colors duration-200"
                  >
                    Agreement
                  </Link>
                </div>
              </div>
              <Link
                href="/repair"
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                Repair
              </Link>
              <Link
                href="/contact"
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2940)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black" />
        </div>

        <div
          className={`relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h1 className="text-6xl md:text-8xl font-medium tracking-tight mb-6 leading-tight">
            Perjanjian
            <br />
            <span className="text-white/40">Sewaan</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto font-light">
            Terma dan syarat perjanjian sewaan peralatan kamera antara Pemberi
            Sewa dan Penyewa.
          </p>
        </div>
      </section>

      {/* Agreement Content */}
      <section className="py-16 px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-medium mb-4">
                Perjanjian Sewaan Peralatan Kamera
              </h2>
              <p className="text-white/60 leading-relaxed">
                Perjanjian ini dibuat di antara{" "}
                <span className="text-white font-medium">
                  FocusHouse / Sewa Camera JB
                </span>{" "}
                (&quot;Pemberi Sewa&quot;) dan pihak penyewa
                (&quot;Penyewa&quot;). Dengan menandatangani perjanjian ini,
                kedua-dua pihak bersetuju untuk mematuhi terma dan syarat yang
                dinyatakan di bawah.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {agreementSections.map((section, index) => (
              <div
                key={index}
                className={`bg-white/5 rounded-2xl p-8 border border-white/10 transition-all duration-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-medium mb-4">{section.title}</h3>
                <div className="space-y-3">
                  {section.content.map((item, i) => (
                    <p
                      key={i}
                      className="text-white/60 leading-relaxed pl-4 border-l-2 border-white/10"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Important Notice */}
          <div className="mt-12 bg-white/5 rounded-2xl p-8 border border-white/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <svg
                  className="w-5 h-5 text-white/60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Nota Penting</h3>
                <p className="text-white/60 leading-relaxed">
                  Sila baca dan fahami semua terma dan syarat sebelum
                  menandatangani perjanjian sewaan. Sebarang persoalan atau
                  kemusykilan boleh diajukan kepada pihak Pemberi Sewa sebelum
                  proses sewaan dimulakan. Perjanjian ini akan berkuat kuasa
                  sebaik sahaja ditandatangani oleh kedua-dua pihak.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-white/40 mb-6">
              Ada soalan mengenai perjanjian sewaan?
            </p>
            <Link
              href="/accessories"
              className="inline-block px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-200 text-lg"
            >
              Lihat Combo Package
            </Link>
          </div>
        </div>
      </section>

      <ContactSection />

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-2xl font-medium tracking-tight">
              FocusHouse
            </div>
            <div className="text-white/40 text-sm">
              © 2026 FocusHouse Photography. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
