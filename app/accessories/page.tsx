"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ContactSection from "@/components/contact-section";

interface Accessory {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  quantity: number;
  pricePerDay: number;
  images: string[];
  isActive: boolean;
}

interface ComboItem {
  id: string;
  accessory: Accessory;
  quantity: number;
}

interface Combo {
  id: string;
  name: string;
  description: string | null;
  price: number;
  images: string[];
  items: ComboItem[];
}

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

type Tab = "accessories" | "combo" | "agreement";

function AccessoriesContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab: Tab =
    tabParam === "combo" || tabParam === "agreement" ? tabParam : "accessories";

  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    requestAnimationFrame(() => setIsLoaded(true));

    fetch("/api/accessories")
      .then((res) => res.json())
      .then((data) => setAccessories(data))
      .catch(() => {});

    fetch("/api/accessory-combos")
      .then((res) => res.json())
      .then((data) => setCombos(data))
      .catch(() => {});
  }, []);

  const categories = [
    "all",
    ...new Set(
      accessories.map((a) => a.category).filter((c): c is string => c !== null),
    ),
  ];

  const filteredAccessories =
    selectedCategory === "all"
      ? accessories
      : accessories.filter((a) => a.category === selectedCategory);

  const tabs: { key: Tab; label: string; href: string }[] = [
    { key: "accessories", label: "Camera & Accessories", href: "/accessories" },
    { key: "combo", label: "Combo Package", href: "/accessories?tab=combo" },
    {
      key: "agreement",
      label: "Agreement",
      href: "/accessories?tab=agreement",
    },
  ];

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
                    className="block px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors duration-200"
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
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=2940)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
        </div>

        <div
          className={`relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <img
            src="/scjb_logo.png"
            alt="FocusHouse"
            className="h-40 md:h-40 w-auto mx-auto mb-8 object-contain"
          />
          <h1 className="text-6xl md:text-8xl font-medium tracking-tight mb-6 leading-tight">
            {activeTab === "agreement" ? (
              <>
                Perjanjian
                <br />
                <span className="text-white/40">Sewaan</span>
              </>
            ) : activeTab === "combo" ? (
              <>
                Combo
                <br />
                <span className="text-white/40">Packages</span>
              </>
            ) : (
              <>Sewa Camera JB</>
            )}
          </h1>
          <p className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto font-light">
            {activeTab === "agreement"
              ? "Terma dan syarat perjanjian sewaan peralatan kamera antara Pemberi Sewa dan Penyewa."
              : activeTab === "combo"
                ? "Bundled camera gear packages at special prices for your convenience."
                : "Access high-quality cameras, lenses, lighting, and accessories for your photography needs."}
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-6 px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {tabs.map((tab) => (
              <Link
                key={tab.key}
                href={tab.href}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-white text-black"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      {activeTab === "accessories" && (
        <>
          {/* Category Filter */}
          {categories.length > 1 && (
            <section className="py-4 px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-wrap gap-3 justify-center">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedCategory === category
                          ? "bg-white/20 text-white"
                          : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60 border border-white/5"
                      }`}
                    >
                      {category === "all"
                        ? "All Items"
                        : category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Accessories Grid */}
          <section className="py-16 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {filteredAccessories.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-white/40 text-lg">
                    No accessories available at the moment. Please check back
                    soon!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredAccessories.map((accessory, index) => (
                    <div
                      key={accessory.id}
                      className={`group relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-[1.02] ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <div className="aspect-[4/3] bg-gradient-to-br from-white/10 to-white/5 relative overflow-hidden">
                        {accessory.images.length > 0 ? (
                          <img
                            src={accessory.images[0]}
                            alt={accessory.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              className="w-16 h-16 text-white/20"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-2xl font-medium mb-1">
                            {accessory.name}
                          </h3>
                        </div>
                      </div>

                      <div className="p-6">
                        {accessory.description && (
                          <p className="text-white/60 mb-4 line-clamp-2">
                            {accessory.description}
                          </p>
                        )}

                        <div className="space-y-2 mb-4 text-sm">
                          {accessory.category && (
                            <div className="flex items-center text-white/40">
                              <svg
                                className="h-4 w-4 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                />
                              </svg>
                              {accessory.category}
                            </div>
                          )}
                          <div className="flex items-center text-white/40">
                            <svg
                              className="h-4 w-4 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>
                            {accessory.quantity} available
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                          <div className="text-3xl font-medium">
                            RM{accessory.pricePerDay}
                          </div>
                          <div className="text-white/40 text-sm">per day</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {activeTab === "combo" && (
        <section className="py-16 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {combos.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-white/40 text-lg">
                  No combo packages available at the moment. Please check back
                  soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {combos.map((combo, index) => (
                  <div
                    key={combo.id}
                    className={`group relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 transition-all duration-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="aspect-[4/3] bg-gradient-to-br from-white/10 to-white/5 relative overflow-hidden">
                      {combo.images.length > 0 ? (
                        <img
                          src={combo.images[0]}
                          alt={combo.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-16 h-16 text-white/20"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-medium mb-1">
                          {combo.name}
                        </h3>
                      </div>
                    </div>

                    <div className="p-6">
                      {combo.description && (
                        <p className="text-white/60 mb-4 line-clamp-2">
                          {combo.description}
                        </p>
                      )}

                      {combo.items.length > 0 && (
                        <div className="mb-4">
                          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">
                            Includes
                          </p>
                          <div className="space-y-1.5">
                            {combo.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center text-sm text-white/60"
                              >
                                <svg
                                  className="h-3.5 w-3.5 mr-2 text-white/30"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                {item.quantity > 1 && (
                                  <span className="text-white/40 mr-1">
                                    {item.quantity}x
                                  </span>
                                )}
                                {item.accessory.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t border-white/10">
                        <div className="text-3xl font-medium">
                          RM{combo.price}
                        </div>
                        <div className="text-white/40 text-sm">combo price</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {activeTab === "agreement" && (
        <section className="py-16 px-6 lg:px-8">
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
          </div>
        </section>
      )}

      <ContactSection />

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-2xl font-medium tracking-tight">
              FocusHouse
            </div>
            <div className="text-white/40 text-sm">
              &copy; 2026 FocusHouse Photography. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function AccessoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      }
    >
      <AccessoriesContent />
    </Suspense>
  );
}
