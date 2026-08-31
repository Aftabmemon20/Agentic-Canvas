import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Visual Learn — Understand anything visually",
  description: "Type any topic and get an instant visual diagram + explanation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
