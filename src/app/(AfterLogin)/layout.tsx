"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { SlCamrecorder } from "react-icons/sl";
import { MdOutlinePlaylistPlay, MdGroups } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { usePathname, useRouter } from "next/navigation";
import RQProvider from "./_component/RQProvider";
import AlertMessage from "./_component/AlertMessage";
import { useModal } from "@/components/Modal/useModal";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";

export default function AfterLoginLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const navItems = [
    { href: "/interview/setting", icon: SlCamrecorder, label: "영상 녹화" },
    { href: "/videos", icon: MdOutlinePlaylistPlay, label: "면접 영상 목록" },
    { href: "/community?tab=reviews", icon: MdGroups, label: "커뮤니티" },
    { href: "/my?tab=videos", icon: CgProfile, label: "마이페이지" },
    { href: "/alerts", icon: HiOutlineBellAlert, label: "알림" },
  ];

  const getCurrentLabel = () => {
    const currentNavItem = navItems.find((item) => pathname.startsWith(item.href.split("?")[0]));
    return currentNavItem?.label;
  };

  const handleBackClick = () => {
    if (pathname.startsWith("/community/create") || pathname.startsWith("/community/edit")) {
      openModal(
        <Modal
          header="글 작성을 종료하시겠습니까?"
          disableBackdropClick={false}
          footer={
            <div className="flex justify-end gap-2">
              <Button onClick={closeModal} variant="outline">
                계속하기
              </Button>
              <Button
                onClick={() => {
                  router.back();
                  closeModal();
                }}
                variant="destructive"
              >
                종료하기
              </Button>
            </div>
          }
        >
          <p>작성 중이신 내용은 삭제됩니다.</p>
        </Modal>,
      );
    } else {
      router.back();
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* 데스크탑 네비게이션 (Side)*/}
        <div className="hidden md:flex min-h-screen fixed top-0 left-0 w-64 bg-white shadow-lg z-10">
          <div className="flex flex-col justify-between w-64">
            <div className="flex items-center justify-center h-20 bg-gray-100 text-black font-bold text-xl">
              <img src="/logo.png" alt="logo" className="w-20" />
            </div>
            <nav className="flex flex-col flex-1">
              {navItems.map((item) => {
                const basePath = item.href.split("?")[0].split("/")[1];
                const isActive = pathname.startsWith(`/${basePath}`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center py-4 px-6 text-sm transition-all duration-300 ${
                      isActive
                        ? "bg-gray-400 text-white scale-105 shadow-lg"
                        : "text-black hover:bg-gray-200 hover:text-gray-700"
                    }`}
                  >
                    <item.icon
                      className={`mr-4 transition-transform duration-300 ${
                        isActive ? "text-white transform scale-110" : "text-base"
                      }`}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* 여기에 Title도 들어가면 좋을 것 같아요 */}
        <div className="flex-1 md:ml-64 relative">
          <svg
            stroke="currentColor"
            fill="currentColor"
            viewBox="0 0 448 512"
            cursor="pointer"
            height="30"
            width="30"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-600 mt-5 ml-6 absolute top-0 left-0 z-20"
            onClick={handleBackClick}
          >
            <path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"></path>
          </svg>
          {/* 타이틀 부분 */}
          <div className="flex items-center justify-between h-16 text-black font-bold text-2xl">
            {getCurrentLabel() && (
              <h1 className="text-2xl font-bold mt-5 ml-16">{getCurrentLabel()}</h1>
            )}
          </div>
          <div className="w-full mt-4 pl-6 pr-8 pb-20">
            <RQProvider>{children}</RQProvider>
          </div>
        </div>

        {/* 모바일 네비게이션 */}
        <div className="md:hidden fixed bottom-0 left-0 w-full h-20 bg-white shadow-lg z-10 flex justify-around items-center">
          {navItems.map((item) => {
            const basePath = item.href.split("?")[0].split("/")[1];
            const isActive = pathname.startsWith(`/${basePath}`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-2 ${
                  isActive ? "text-blue-500" : "text-gray-500"
                }`}
              >
                <item.icon className="text-3xl" />
              </Link>
            );
          })}
        </div>
      </div>
      <AlertMessage />
    </>
  );
}
