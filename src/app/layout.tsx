"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-ignore
import { AnimatedBackground } from "animated-backgrounds";
/* eslint-enable @typescript-eslint/ban-ts-comment */



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <title>Music Recommender Engine</title>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AnimatedBackground animationName="starryNdnaHelixight" blendMode="darken" />
        {children}
      </body>
    </html>
  );
}
