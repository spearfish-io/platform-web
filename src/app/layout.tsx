import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import { AuthSessionProvider } from "@/components/auth/session-provider";
import { TenantProvider } from "@/contexts/tenant-context";
import { auth } from "@/lib/auth";
import { MSWProvider } from "@/components/msw-provider";
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
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌐</text></svg>",
  },
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
                {children}
              </Theme>
            </TenantProvider>
          </AuthSessionProvider>
        </MSWProvider>
      </body>
    </html>
  );
}
