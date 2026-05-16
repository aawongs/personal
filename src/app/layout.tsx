import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReadableRx",
  description: "Accessible prescription label reader for large-print medication cards."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
