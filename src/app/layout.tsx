import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SupabaseProvider from "@/components/SupabaseProvider";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PCL找搭子 - 端游联机平台",
  description: "找到一起开黑的那个TA - PCL找搭子是端游联机匹配平台，帮你快速找到志同道合的游戏搭子",
  keywords: ["PCL", "找搭子", "联机", "开黑", "我的世界", "Minecraft", "游戏搭子", "端游"],
  openGraph: {
    title: "PCL找搭子 - 端游联机平台",
    description: "找到一起开黑的那个TA",
    type: "website",
    locale: "zh_CN",
    siteName: "PCL找搭子",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PCL找搭子" />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50 dark:bg-[#0f0f1a] text-gray-900">
        <div
          aria-hidden
          className="fixed inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(124, 58, 237, 0.16), transparent), radial-gradient(ellipse 40% 40% at 90% 10%, rgba(217, 70, 239, 0.10), transparent), radial-gradient(ellipse 40% 40% at 10% 20%, rgba(99, 102, 241, 0.12), transparent)",
          }}
        />
        <SupabaseProvider>
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </SupabaseProvider>
      </body>
    </html>
  );
}