"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getToken } from "firebase/messaging";
import { messaging } from "@/firebase";

// 임시로 만들었습니다.

interface PermissionProps {
  link: string;
}

const Permission = ({ link }: PermissionProps) => {
  const [permission, setPermission] = useState<NotificationPermission>("default");

  const permissionNotification = async () => {
    console.log("Requesting permission...");
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("Notification permission granted.");
      setPermission("granted");
    } else {
      console.log("No registration token available. Request permission to generate one.");
    }
  };

  useEffect(() => {
    // 권한 확인
    console.log("브라우저 지원 여부:", Notification.permission);

    if (Notification.permission === "granted") {
      console.log("알림 권한 허용됨");
      setPermission("granted");
    }

    if (Notification.permission === "denied") {
      console.log("알림 권한 거부됨");
      setPermission("denied");
    }

    if (Notification.permission === "default") {
      console.log("알림 권한 기본값");
      setPermission("default");
    }
  }, [permission]);

  // FCM 서비스 워커 등록
  useEffect(() => {
    navigator.serviceWorker
      .register("firebase-messaging-sw.js")
      .then(() => navigator.serviceWorker.ready);

    navigator.serviceWorker
      .register("firebase-messaging-sw.js", { scope: "/" })
      .then(() => navigator.serviceWorker.ready);

    navigator.serviceWorker
      .register("firebase-messaging-sw.js")
      .then((registration) => registration.update())
      .then(() => navigator.serviceWorker.ready);

    if (permission === "granted") {
      // FCM 서비스 워커 등록
      getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      });

      console.log("FCM 서비스 워커 등록");
    }
  }, [permission]);

  return (
    <div>
      <p>테스트를 위한 임시 컴포넌트입니다.</p>
      <h1>알림 권한 요청</h1>
      <p>
        서비스를 이용하기 위해 <u>알림 권한</u>이 필요합니다.
      </p>
      <Button
        className="w-max-[350px] w-full h-[70px] rounded-full bg-[#FFFFFF] border border-slate-300 text-black text-xl mt-4"
        onClick={permissionNotification}
      >
        알림 허용하기
      </Button>

      <Link href={link}>
        <Button disabled={permission !== "granted"}>로그인</Button>
      </Link>
    </div>
  );
};

export default Permission;
