import type { Metadata } from "next";
import "./globals.css";
import "./premium.css";
import "./map-preview.css";
import "./map-world.css";
import "./game-menu.css";
import "./dark-theme.css";

export const metadata: Metadata = {
  title: "Chacha",
  description: "Four teams. Three worlds. Own the hill. Play Chacha with friends from any device.",
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
