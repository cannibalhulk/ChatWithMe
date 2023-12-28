import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import  RecoilRoot  from "@/components/RecoilProvider";
import { GeistSans } from "geist/font";
import SessionProvider from "@/components/AuthProvider";
import NextUIProv from "@/components/NextUIProv";
import Navbar from "@/components/ui/Navbar";
import "../globals.css";
import { getServerSession } from "next-auth";
import NextThemesProvider from "@/components/NextThemesProvider";
import dynamic from "next/dynamic";

const geist = GeistSans;

export const metadata: Metadata = {
  title: "ChatWithMe",
  description: "A next-gen chat app for friends",
};

const DynamicAblyProvider = dynamic(()=> import('@/components/Ably/AblyProvider'), {
  ssr:false
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={geist.className}>
        <RecoilRoot>
          <SessionProvider  session={session}>
            <DynamicAblyProvider>  {/**`input must not start with prefix url` bug fixed */}
              <NextUIProv>
                <NextThemesProvider attribute="class" defaultTheme="dark">
                  <Navbar />
                  {children}
                  <Analytics />
                  <SpeedInsights />
                </NextThemesProvider>
              </NextUIProv>
            </DynamicAblyProvider>
          </SessionProvider>
        </RecoilRoot>
      </body>
    </html>
  );
}
