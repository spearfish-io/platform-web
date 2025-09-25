import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import { AuthSessionProvider } from "@/components/auth/session-provider";
import { TenantProvider } from "@/contexts/tenant-context";
import { auth } from "@/lib/auth";
import { MSWProvider } from "@/components/msw-provider";
import "./globals.css";
import ClientProviders from "./ClientProviders";

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
  description:
    "A modern Next.js prototype with Radix UI Themes demonstrating latest web development best practices",
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
        <MSWProvider>
          <AuthSessionProvider session={session}>
            <TenantProvider>
              <Theme
                accentColor="blue"
                grayColor="slate"
                radius="medium"
                scaling="100%"
                appearance="inherit"
              >
                <ClientProviders>{children}</ClientProviders>
              </Theme>
            </TenantProvider>
          </AuthSessionProvider>
        </MSWProvider>
      </body>
    </html>
  );
}
