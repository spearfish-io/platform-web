import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import { AuthSessionProvider } from "@/components/auth/session-provider";
import { auth } from "@/lib/auth";
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
  title: "Platform Web - Modern Next.js Application",
  description: "A modern Next.js prototype with Radix UI Themes demonstrating latest web development best practices",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthSessionProvider session={session}>
          <Theme
            accentColor="blue"
            grayColor="slate"
            radius="medium"
            scaling="100%"
            appearance="inherit"
          >
            {children}
          </Theme>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
