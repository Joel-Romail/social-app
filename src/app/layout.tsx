import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Providers from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Social App",
  description: "An Instagram-inspired social media platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
