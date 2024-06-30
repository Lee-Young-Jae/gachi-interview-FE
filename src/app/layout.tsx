import type { Metadata } from "next";
import RootLayout from "./_component/RootLayout";

export const metadata: Metadata = {
  title: "같이면접",
  description: "같이 면접 준비하는 서비스.",
  icons: {
    icon: "/favicon.png",
  },
  keywords: ["같이면접", "면접", "면접준비", "면접연습", "AI면접관"],
  applicationName: "같이면접",
  openGraph: {
    title: "같이면접",
    description: "면접 준비 어려우셨죠? 같이 준비해요!. AI 면접관과 함께하는 면접 연습 서비스",
    type: "website",
    url: "https://gachi-interview.vercel.app",
    locale: "ko_KR",
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
