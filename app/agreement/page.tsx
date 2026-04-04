"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ContactSection from "@/components/contact-section";
import Navbar from "@/components/navbar";

const agreementSections = [
  {
    title: "1. Definisi",
    content: [
      '"Pemberi Sewa" merujuk kepada FocusHouse / Sewa Camera JB.',
      '"Penyewa" merujuk kepada individu yang menyewa peralatan daripada Pemberi Sewa seperti maklumat yang dinyatakan di Jadual 1.',
      '"Peralatan" merujuk kepada kamera, lensa, aksesori, dan lain-lain peralatan yang disewa bersama seperti yang dinyatakan dalam Jadual 2.',
      '"Deposit" merujuk kepada jumlah wang yang dibayar sebagai cagaran seperti yang dinyatakan dalam Jadual 2.',
      '"Jumlah Keseluruhan" merujuk kepada jumlah keseluruhan bayaran sewaan seperti yang dinyatakan dalam Jadual 2.',
      "Tarikh Perjanjian - Bermaksud tarikh yang dinyatakan dalam Seksyen 1 Jadual 1",
      "Tempoh Sewa - Bermaksud tempoh sewa peralatan dalam Seksyen 3 Jadual 1",
    ],
  },
  {
    title: "2. Akuan dan Persetujuan Penyewa",
    content: [
      "Penyewa dengan ini berakujanji, mengakui, memahami, dan bersetuju bahawa:",
      "2.1  Penyewa bukan seorang yang diisytiharkan bankrap dan mempunyai kapasiti undang-undang untuk memasuki Perjanjian ini;",
      "2.2  Penyewa ialah individu yang sama seperti maklumat yang diberikan di Jadual 1 dan Jadual 3;",
      "2.3  Pemilikan Peralatan yang disewa adalah sepenuhnya milik Pemberi Sewa; dan",
      "2.4  Penyewa bertanggungjawab untuk memastikan Peralatan selamat, dijaga dalam keadaan yang baik sepanjang Tempoh Sewa, dan mengelakkan Peralatan terdedah kepada apa-apa keadaan yang boleh, mampu dan/atau mungkin menjejaskan kualiti dan keadaan Peralatan tersebut, sepanjang Tempoh Sewa.",
    ],
  },
  {
    title: "3. Pembayaran, Sewaan dan Deposit",
    content: [
      "3.1  Sejurus selepas Perjanjian ini ditandatangani, Penyewa hendaklah membayar Jumlah Keseluruhan seperti yang dinyatakan di Jadual 2 kepada Pemberi Sewa pada Tarikh Perjanjian.",
      "3.2  Dengan menandatangani Perjanjian ini, Penyewa dengan ini mengakui bahawa Penyewa telah memeriksa Peralatan tersebut, dan telah menerima Peralatan seperti yang dinyatakan dalam Jadual 2 dengan selamat dan dalam keadaan berfungsi dengan baik tanpa sebarang kerosakan.",
      '3.3  Pada tamat Tempoh Sewa atau pada tarikh dan masa yang ditetapkan Pemberi Sewa , Penyewa hendaklah memulangkan semula Peralatan dengan selamat dan dalam keadaan berfungsi yang baik ("good working condition") kepada Pemberi Sewa.',
      "3.4  Sejurus selepas penerimaan Peralatan dari Penyewa dan Pemberi Sewa berpuas hati Peralatan tersebut dalam keadaan asal dan keadaan berfungsi yang baik, Pemberi Sewa hendaklah memulangkan semula Deposit kepada Penyewa.",
      "3.5  Sekiranya Peralatan yang dipulangkan Penyewa bukan dalam keadaan berfungsi yang baik, rosak, hilang dan/atau tidak dipulangkan dalam masa yang ditetapkan, Penyewa hendaklah bertanggungjawab mempampas dan/atau membayar kepada Pemberi Sewa bagi keseluruhan kos penggantian dan/atau pembaikan Peralatan tersebut.",
      "3.6  Walau apa pun peruntukan dalam Perjanjian ini, sekiranya Penyewa gagal, enggan dan/atau cuai untuk memulangkan Peralatan dalam masa yang ditetapkan, Pemberi Sewa berhak untuk mengenakan caj lewat pulang Peralatan seperti berikut:",
      "Caj lewat pulang kurang dari dua belas (12) jam : RM50.00",
      "Caj lewat pulang melebihi dua belas (12) jam : Harga Sewa Peralatan bagi tempoh satu (1) hari dan terpakai untuk hari-hari yang seterusnya sehinggalah Peralatan dipulangkan Penyewa",
    ],
  },
  {
    title: "4. Kemungkiran dan/atau Pelanggaran Perjanjian",
    content: [
      "Dalam keadaan Penyewa gagal, enggan dan/atau cuai untuk membayar mana-mana bahagian Jumlah Keseluruhan atau Jumlah Harga Sewa atau melakukan apa-apa kemungkiran Perjanjian ini, Pemberi Sewa berhak untuk mengambil tindakan-tindakan berikut:",
      "4.1  Pemberi Sewa mengambil, merampas dan/atau melucutkan Deposit;",
      "4.2  Menuntut bagi baki sewa, caj lewat pulang dan Jumlah Keseluruhan yang belum dibayar dan yang belum kena bayar oleh Penyewa;",
      "4.3  Perkongsian maklumat kepada CTOS; dan",
      "4.4  Mengambil tindakan undang-undang yang sepatutnya dan wajar bagi mendapatkan semula apa-apa kerugian yang dialami oleh Pemberi Sewa.",
    ],
  },
  {
    title: "5. Larangan Pemindahan Hak Sewa",
    content: [
      "Penyewa tidak dibenarkan memindahkan hak sewa Peralatan, dan/atau menyewa semula Peralatan kepada pihak ketiga tanpa kebenaran bertulis daripada Pemberi Sewa.",
    ],
  },
  {
    title: "6. Pemulangan Awal Peralatan",
    content: [
      "Sekiranya Peralatan dipulangkan oleh Penyewa sebelum Tempoh Sewa tamat, tiada sebarang pengembalian bayaran sewa bagi tempoh yang tidak digunakan, melainkan dengan persetujuan kedua-dua pihak.",
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
      <Navbar />

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
          {/* Intro */}
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

          {/* Agreement Sections */}
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

          {/* Renter Acknowledgment */}
          <div className="mt-12 bg-white/5 rounded-2xl p-8 border border-white/10">
            <p className="text-white/80 leading-relaxed italic text-lg mb-4">
              Saya, Penyewa yang dinamakan di Seksyen 2 Jadual 1, dengan ini
              mengakui, berakujanji dan bersetuju bahawa saya telah membaca
              kesemua peruntukan Perjanjian ini dengan cermat dan berhati-hati,
              dan tidak bergantung pada mana-mana kenyataan, atau representasi
              yang dibuat oleh Pemberi Sewa selain dari yang terkandung dalam
              Perjanjian ini.
            </p>
            <p className="text-white/80 leading-relaxed italic text-lg">
              Saya bersetuju untuk terikat dengan segala terma dan syarat
              Perjanjian ini, termasuklah apa-apa lampiran atau jadual yang
              berkaitan dan dirujuk di sini.
            </p>
          </div>

          {/* JADUAL 1 */}
          <div className="mt-12 bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white">JADUAL 1</h3>
              <p className="text-white/60 text-sm mt-1">
                (yang mana diambil, dibaca bersama dan ditafsirkan sebagai
                sebahagian penting dari Perjanjian ini)
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-white/10">
                    <th className="border border-white/20 px-4 py-3 text-left text-white font-medium w-16">
                      Seksyen
                    </th>
                    <th className="border border-white/20 px-4 py-3 text-left text-white font-medium w-40">
                      Perkara
                    </th>
                    <th className="border border-white/20 px-4 py-3 text-left text-white font-medium">
                      Butiran
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-white/20 px-4 py-3 text-white/60 align-top">
                      1.
                    </td>
                    <td className="border border-white/20 px-4 py-3 text-white/60 align-top">
                      Tarikh Perjanjian
                    </td>
                    <td className="border border-white/20 px-4 py-3 text-white/60 text-center">
                      —
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-white/20 px-4 py-3 text-white/60 align-top">
                      2.
                    </td>
                    <td className="border border-white/20 px-4 py-3 text-white/60 align-top">
                      Butiran Penyewa
                    </td>
                    <td className="border border-white/20 px-4 py-3 text-white/60">
                      <div className="space-y-1">
                        <p>
                          <span className="font-medium text-white/80">
                            Nama:
                          </span>{" "}
                          ___________________________
                        </p>
                        <p>
                          <span className="font-medium text-white/80">
                            No. K/P:
                          </span>{" "}
                          ___________________________
                        </p>
                        <p>
                          <span className="font-medium text-white/80">
                            Alamat:
                          </span>{" "}
                          ___________________________
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-white/20 px-4 py-3 text-white/60 align-top">
                      3.
                    </td>
                    <td className="border border-white/20 px-4 py-3 text-white/60 align-top">
                      Tempoh Sewa
                    </td>
                    <td className="border border-white/20 px-4 py-3 text-white/60">
                      <div className="space-y-1">
                        <p>
                          <span className="font-medium text-white/80">
                            Tempoh:
                          </span>{" "}
                          ___ Hari
                        </p>
                        <p>
                          <span className="font-medium text-white/80">
                            Bermula pada:
                          </span>{" "}
                          ___________________________
                        </p>
                        <p>
                          <span className="font-medium text-white/80">
                            Tamat pada:
                          </span>{" "}
                          ___________________________
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* JADUAL 2 */}
          <div className="mt-8 bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white">JADUAL 2</h3>
              <p className="text-white/60 text-sm mt-1">
                (yang mana diambil, dibaca bersama dan ditafsirkan sebagai
                sebahagian penting dari Perjanjian ini)
              </p>
            </div>
            <h4 className="text-center font-bold text-white mb-4">
              SENARAI PERALATAN DAN HARGA
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-white/10">
                    <th className="border border-white/20 px-4 py-3 text-left text-white font-medium w-16">
                      No.
                    </th>
                    <th className="border border-white/20 px-4 py-3 text-left text-white font-medium">
                      Butiran Peralatan
                    </th>
                    <th className="border border-white/20 px-4 py-3 text-right text-white font-medium w-40">
                      Harga (RM)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <tr key={num}>
                      <td className="border border-white/20 px-4 py-3 text-white/60">
                        {num}.
                      </td>
                      <td className="border border-white/20 px-4 py-3 text-white/60">
                        &nbsp;
                      </td>
                      <td className="border border-white/20 px-4 py-3 text-white/60 text-right">
                        &nbsp;
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-white/5">
                    <td
                      colSpan={2}
                      className="border border-white/20 px-4 py-3 text-white font-medium"
                    >
                      Jumlah Harga Sewa (RM)
                    </td>
                    <td className="border border-white/20 px-4 py-3 text-white/60 text-right">
                      &nbsp;
                    </td>
                  </tr>
                  <tr className="bg-white/5">
                    <td
                      colSpan={2}
                      className="border border-white/20 px-4 py-3 text-white font-medium"
                    >
                      Deposit (RM)
                    </td>
                    <td className="border border-white/20 px-4 py-3 text-white/60 text-right">
                      &nbsp;
                    </td>
                  </tr>
                  <tr className="bg-white/5">
                    <td
                      colSpan={2}
                      className="border border-white/20 px-4 py-3 text-white font-medium"
                    >
                      Booking (RM)
                    </td>
                    <td className="border border-white/20 px-4 py-3 text-white/60 text-right">
                      &nbsp;
                    </td>
                  </tr>
                  <tr className="bg-white/5">
                    <td
                      colSpan={2}
                      className="border border-white/20 px-4 py-3 text-white font-medium"
                    >
                      Caj Penghantaran (RM)
                    </td>
                    <td className="border border-white/20 px-4 py-3 text-white/60 text-right">
                      &nbsp;
                    </td>
                  </tr>
                  <tr className="bg-white/10">
                    <td
                      colSpan={2}
                      className="border border-white/20 px-4 py-3 text-white font-bold"
                    >
                      JUMLAH KESELURUHAN (RM)
                    </td>
                    <td className="border border-white/20 px-4 py-3 text-white font-bold text-right">
                      &nbsp;
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-white font-medium text-sm">
              Jumlah yang perlu dibayar Penyewa : RM ___________
            </p>
          </div>

          {/* JADUAL 3 */}
          <div className="mt-8 bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white">JADUAL 3</h3>
              <p className="text-white/60 text-sm mt-1">
                (yang mana diambil, dibaca bersama dan ditafsirkan sebagai
                sebahagian penting dari Perjanjian ini)
              </p>
            </div>
            <h4 className="text-center font-bold text-white mb-6">
              SALINAN DOKUMEN PENGENALAN DIRI PENYEWA
            </h4>
            <div className="flex justify-center">
              <div className="w-full max-w-lg rounded-xl overflow-hidden border border-white/20">
                <img
                  src="/mykad.avif"
                  alt="Contoh MyKad Malaysia"
                  className="w-full object-cover"
                />
              </div>
            </div>
            <p className="text-center text-white/40 text-sm mt-4">
              Salinan MyKad / Dokumen Pengenalan Diri Penyewa
            </p>
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
