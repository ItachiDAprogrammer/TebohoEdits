import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const batmanForever = {
  variable: "--font-batman-forever",
  src: "url('https://fonts.cdnfonts.com/css/batman-forever')",
};

export const metadata: Metadata = {
  title: "Teboho Edits - Creative Video Editor | Visual Storyteller",
  description: "Professional video editing services by Teboho Edits. Transforming visuals into meaningful stories with Filmora, CapCut, and DaVinci Resolve. Specializing in YouTube videos and Instagram Reels.",
  keywords: ["Teboho Edits", "Video Editor", "YouTube Editing", "Instagram Reels", "Filmora", "CapCut", "DaVinci Resolve", "Color Grading", "Motion Graphics"],
  authors: [{ name: "Teboho Edits" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Teboho Edits - Creative Video Editor",
    description: "Professional video editing services for YouTube and Instagram. Clean edits, engaging pacing, and social-media-optimized visuals.",
    url: "https://tebohoedits.com",
    siteName: "Teboho Edits",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Teboho Edits - Creative Video Editor",
    description: "Professional video editing services for YouTube and Instagram.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link
          href="https://fonts.cdnfonts.com/css/batman-forever"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
