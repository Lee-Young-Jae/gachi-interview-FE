"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getToken } from "firebase/messaging";
import { messaging, isSupportedBrowser, isSupportedIOS } from "@/firebase";
import { RiKakaoTalkFill } from "react-icons/ri";
import { KAKAO_AUTH_URL } from "../_lib/kakao";
import { GOOGLE_AUTH_URL } from "../_lib/google";
import { FcGoogle } from "react-icons/fc";

// 임시로 만들었습니다.

const Permission = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");

  const permissionNotification = async () => {
    if (!isSupportedBrowser || !isSupportedIOS) {
      console.log("브라우저가 알림을 지원하지 않습니다.");
      return;
    }

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
    async function browserCheck() {
      if (!isSupportedBrowser || !isSupportedIOS) {
        console.log("브라우저가 알림을 지원하지 않습니다.");
        return;
      }

      // 권한 확인
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
    }
    browserCheck();
  }, []);

  // FCM 서비스 워커 등록
  useEffect(() => {
    async function browserCheck() {
      if (!isSupportedBrowser || !isSupportedIOS) {
        console.log("브라우저가 알림을 지원하지 않습니다.");
        return;
      }
    }

    browserCheck();

    // ISSUE: DOMException: Failed to execute 'subscribe' on 'PushManager': Subscription failed - no active Service Worker
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
    // 일단 여러번 호출하는 방식으로 해결
    // 출처 https://github.com/firebase/firebase-js-sdk/issues/7575
    // 출처 https://github.com/firebase/firebase-js-sdk/issues/7693

    if (permission === "granted") {
      // FCM 서비스 워커 등록
      const tokenPromise = getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      });

      tokenPromise.then((token) => {
        console.log("FCM 토큰:", token);
        localStorage.setItem("fcmToken", token);
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
        className="w-max-[350px] w-full h-[70px] rounded-full bg-[#FFFFFF] border border-slate-300 text-black text-xl my-4"
        onClick={permissionNotification}
      >
        알림 허용하기
      </Button>
      <span>알림 권한: {permission}, 버튼은 알림이 허용되어야 활성화</span>
      <Link href={KAKAO_AUTH_URL} passHref>
        <Button
          disabled={permission !== "granted"}
          className={`w-max-[350px] w-full h-[70px] rounded-full bg-[#FEE500] text-black text-xl ${
            permission !== "granted" ? "cursor-not-allowed" : ""
          }`}
        >
          <RiKakaoTalkFill className="mr-2" />
          Kakao로 시작하기
        </Button>
      </Link>
      <Link href={GOOGLE_AUTH_URL} passHref>
        <Button
          disabled={permission !== "granted"}
          className={`w-max-[350px] w-full h-[70px] rounded-full bg-[#FFFFFF] border border-slate-300 text-black text-xl mt-4 ${
            permission !== "granted" ? "cursor-not-allowed" : ""
          }`}
        >
          <FcGoogle className="mr-2" />
          Google로 시작하기
        </Button>
      </Link>
    </div>
  );
};

export default Permission;
