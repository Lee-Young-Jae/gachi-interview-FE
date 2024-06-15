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

// 임시로 만들었습니다. 승학님과 논의 후 수정 혹은 삭제가 필요합니다.
// 알림 권한을 받기 위한 컴포넌트입니다.
// 기존 login 로직(googleAuth2Redirect/kakaoAuth2Redirect) 에서 서비스 워커가 등록되지 않아서 발생하는 문제를 해결하기 위해 만들었습니다.
// 관련 에러
// DOMException: Failed to execute 'subscribe' on 'PushManager': Subscription failed - no active Service Worker
// 서비스 워커를 등록하는 시점을 로그인 이전 단계에서 브라우저에 등록하고, 로그인이 끝나면 서비스 워커를 등록하는 방식으로 해결하고자 Permission 컴포넌트를 만들었습니다.

const Permission = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");

  // 예외처리 하는이유: Notification이 지원되지 않는 브라우저에서는 Application error: a client-side exception has occurred (see the browser console for more information). 에러가 발생함
  // Can't find variable: Notification 에러가 발생하며 웹이 죽음
  // https://caniuse.com/?search=Notification Can I Use를 참고해봤을 때 특히 safari는 홈 화면에 추가한(중요) 웹앱에서만 지원한다고 나와있음
  // PWA로 만들어야만 지원이 가능하다는 것 같음 (https://developer.mozilla.org/ko/docs/Web/API/Notification/requestPermission)
  // (https://firebase.blog/posts/2023/08/fcm-for-safari/)
  const permissionNotification = async () => {
    if (!(await isSupportedBrowser) || !isSupportedIOS()) {
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

  const isPermissionGranted = permission === "granted";

  useEffect(() => {
    async function browserCheck() {
      if (!(await isSupportedBrowser) || !isSupportedIOS()) {
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
      if (!(await isSupportedBrowser) || !isSupportedIOS()) {
        console.log("브라우저가 알림을 지원하지 않습니다.");
        return;
      }

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
          // 일단 로컬 스토리지에 저장 (테스트용)
          localStorage.setItem("fcmToken", token);
        });

        console.log("FCM 서비스 워커 등록");
      }
    }

    browserCheck();
  }, [permission]);

  return (
    <div>
      {/* <p>테스트를 위한 임시 컴포넌트입니다.</p>
      <h1>알림 권한 요청</h1> */}
      <>
        <p>
          원활한 서비스 이용을 위해{" "}
          <u className="cursor-pointer text-blue-500" onClick={permissionNotification}>
            알림 허용
          </u>
          을 해주세요.
        </p>
        {isPermissionGranted && (
          <p className="text-green-500 text-sm">알림 권한이 허용되었습니다. 계속 진행해주세요.</p>
        )}
      </>

      <Link href={KAKAO_AUTH_URL} passHref>
        <Button
          disabled={!isPermissionGranted || !isSupportedIOS()}
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
          disabled={!isPermissionGranted || !isSupportedIOS()}
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
