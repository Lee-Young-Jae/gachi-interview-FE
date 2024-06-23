import type { Metadata } from "next";
import RootLayout from "./_component/RootLayout";

export const metadata: Metadata = {
  title: "같이면접",
  description: "같이 면접 준비하는 서비스.",
  icons: {
    icon: "/favicon.png",
  },
  applicationName: "같이면접",
  openGraph: {
    title: "같이면접",
    description: "같이 면접 준비하는 서비스.",
    type: "website",
    url: "https://gachi-interview.vercel.app",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "같이면접",
      },
    ],
  },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <RootLayout>{children}</RootLayout>;
}
