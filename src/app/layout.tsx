import type { Metadata } from "next";
import RootLayout from "./_component/RootLayout";

export const metadata: Metadata = {
  title: "같이면접",
  description: "같이 면접 준비하는 서비스.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <RootLayout>{children}</RootLayout>;
}
