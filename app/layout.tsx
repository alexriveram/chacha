import type { Metadata } from "next";
import "./globals.css";
import "./premium.css";
import "./map-preview.css";

export const metadata: Metadata = {
  title: "Chacha",
  description: "Four teams. Three worlds. Capture points and choose your ultimate fighter.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
