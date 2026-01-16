import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import Providers from "@/components/Providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Sylvaire — Приватный сервер Minecraft",
  description: "Присоединяйся к сообществу игроков. Строй, исследуй и создавай историю вместе с нами.",
  keywords: ["minecraft", "сервер", "приватный", "выживание", "ванилла", "sylvaire"],
  icons: {
    icon: "/assets/logo.png",
    shortcut: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <Toaster position="top-right" richColors theme="dark" />
        </Providers>
      </body>
    </html>
  );
}
