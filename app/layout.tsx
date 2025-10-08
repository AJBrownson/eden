import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CopilotKit } from "@copilotkit/react-core"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ginny - Your AI Powered Budget Planner/Advisor",
  description: "Ginny - Your AI Powered Budget Planner/Advisor built with Next.js and CopilotKit",
};

const publicApiKey = process.env.COPILOT_KEY

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CopilotKit publicApiKey={publicApiKey}>
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}
