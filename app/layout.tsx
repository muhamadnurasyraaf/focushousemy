import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FocusHouse Photography - Professional Photography Sessions",
    template: "%s | FocusHouse Photography",
  },
  description:
    "Professional photography studio specializing in graduation photos, family portraits, and special events. Book your photography session today with FocusHouse.",
  keywords: [
    "photography",
    "graduation photos",
    "family portraits",
    "professional photographer",
    "photo session",
    "studio photography",
  ],
  authors: [{ name: "FocusHouse Photography" }],
  creator: "FocusHouse Photography",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://focushouse.com",
    title: "FocusHouse Photography - Professional Photography Sessions",
    description:
      "Professional photography studio specializing in graduation photos, family portraits, and special events.",
    siteName: "FocusHouse Photography",
  },
  twitter: {
    card: "summary_large_image",
    title: "FocusHouse Photography",
    description:
      "Professional photography studio specializing in graduation photos, family portraits, and special events.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
