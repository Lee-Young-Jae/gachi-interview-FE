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
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// 임시로 만들었습니다. 승학님과 논의 후 수정 혹은 삭제가 필요합니다.
// 알림 권한을 받기 위한 컴포넌트입니다.
// 기존 login 로직(googleAuth2Redirect/kakaoAuth2Redirect) 에서 서비스 워커가 등록되지 않아서 발생하는 문제를 해결하기 위해 만들었습니다.
// 관련 에러
// DOMException: Failed to execute 'subscribe' on 'PushManager': Subscription failed - no active Service Worker
// 서비스 워커를 등록하는 시점을 로그인 이전 단계에서 브라우저에 등록하고, 로그인이 끝나면 서비스 워커를 등록하는 방식으로 해결하고자 Permission 컴포넌트를 만들었습니다.

const Permission = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);
  const router = useRouter();

  // 브라우저와 iOS 지원 여부를 확인하는 함수
  const checkSupport = async () => {
    const supportedBrowser = await isSupportedBrowser;
    const supportedIOS = isSupportedIOS();
    return supportedBrowser && supportedIOS;
  };

  // 예외처리 하는이유: Notification이 지원되지 않는 브라우저에서는 Application error: a client-side exception has occurred (see the browser console for more information). 에러가 발생함
  // Can't find variable: Notification 에러가 발생하며 웹이 죽음
  // https://caniuse.com/?search=Notification Can I Use를 참고해봤을 때 특히 safari는 홈 화면에 추가한(중요) 웹앱에서만 지원한다고 나와있음
  // PWA로 만들어야만 지원이 가능하다는 것 같음 (https://developer.mozilla.org/ko/docs/Web/API/Notification/requestPermission)
  // (https://firebase.blog/posts/2023/08/fcm-for-safari/)

  // 알림 권한 요청을 위한 함수
  const permissionNotification = async () => {
    const supported = await checkSupport();
    if (!supported) {
      toast.info(
        "현재 브라우저에서는 알림 기능을 사용할 수 없습니다.\n다른 브라우저를 이용해 주세요.",
        {
          position: "top-center",
          autoClose: 6000,
          className: "toast-message",
        },
      );
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
    const initialize = async () => {
      const supported = await checkSupport();
      setIsSupported(supported);

      if (!supported) {
        toast.info(
          "현재 브라우저에서는 알림 기능을 사용할 수 없습니다.\n다른 브라우저를 이용해 주세요.",
          {
            position: "top-center",
            autoClose: 6000,
            className: "toast-message",
          },
        );
        return;
      }

      // 권한 확인
      if (Notification.permission === "granted") {
        console.log("알림 권한 허용됨");
        setPermission("granted");
      } else if (Notification.permission === "denied") {
        console.log("알림 권한 거부됨");
        setPermission("denied");
      } else {
        console.log("알림 권한 기본값");
        setPermission("default");
      }
    };

    initialize();
  }, []);

  // FCM 서비스 워커 등록
  useEffect(() => {
    if (!isSupported || permission !== "granted") {
      return;
    }

    // FCM 서비스 워커 등록
    const registerServiceWorker = async () => {
      try {
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

        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        });

        console.log("FCM 토큰:", token);
        // 일단 로컬 스토리지에 저장 (테스트용)
        localStorage.setItem("fcmToken", token);
        console.log("FCM 서비스 워커 등록");
      } catch (error) {
        console.error("FCM 서비스 워커 등록 실패:", error);
      }
    };
    registerServiceWorker();
  }, [isSupported, permission]);

  const kakaoLogin = () => {
    router.replace(KAKAO_AUTH_URL);
  };

  const googleLogin = () => {
    router.replace(GOOGLE_AUTH_URL);
  };

  return (
    <div>
      {/* <p>테스트를 위한 임시 컴포넌트입니다.</p>
      <h1>알림 권한 요청</h1> */}
      {isSupported ? (
        <>
          <p className="pl-2 pb-2">
            원활한 서비스 이용을 위해{" "}
            <u className="cursor-pointer text-blue-500" onClick={permissionNotification}>
              알림 허용
            </u>
            을 해주세요.
          </p>
          {isPermissionGranted && (
            <p className="text-green-500 text-sm pl-2 pb-2">
              알림 권한이 허용되었습니다. 계속 진행해주세요.
            </p>
          )}
          {/* 알림기능을 지원한다면 권한이 허용되지 않으면 로그인 버튼을 비활성화한다 */}
          <Button
            disabled={!isSupported || permission !== "granted"}
            className={`w-max-[350px] w-full h-[70px] rounded-full bg-[#FEE500] text-black text-xl ${
              permission !== "granted" ? "cursor-not-allowed" : ""
            }`}
            onClick={kakaoLogin}
          >
            <RiKakaoTalkFill className="mr-2" />
            Kakao로 시작하기
          </Button>
          <Button
            disabled={!isSupported || permission !== "granted"}
            className={`w-max-[350px] w-full h-[70px] rounded-full bg-[#FFFFFF] border border-slate-300 text-black text-xl mt-4 ${
              permission !== "granted" ? "cursor-not-allowed" : ""
            }`}
            onClick={googleLogin}
          >
            <FcGoogle className="mr-2" />
            Google로 시작하기
          </Button>
        </>
      ) : (
        <>
          {/* 알림을 지원하지 않으면 바로 로그인을 지원한다 */}
          <Button
            className={`w-max-[350px] w-full h-[70px] rounded-full bg-[#FEE500] text-black text-xl`}
            onClick={kakaoLogin}
          >
            <RiKakaoTalkFill className="mr-2" />
            Kakao로 시작하기
          </Button>
          <Button
            className={`w-max-[350px] w-full h-[70px] rounded-full bg-[#FFFFFF] border border-slate-300 text-black text-xl mt-4`}
            onClick={googleLogin}
          >
            <FcGoogle className="mr-2" />
            Google로 시작하기
          </Button>
        </>
      )}
    </div>
  );
};

export default Permission;
