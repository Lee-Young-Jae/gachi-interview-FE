"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getToken } from "firebase/messaging";
import { messaging, isSupportedBrowser, isSupportedIOS } from "@/firebase";
import { RiKakaoTalkFill } from "react-icons/ri";
import { KAKAO_AUTH_URL } from "../_lib/kakao";
import { GOOGLE_AUTH_URL } from "../_lib/google";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Permission = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);
  const router = useRouter();

  const checkSupport = async () => {
    const supportedBrowser = await isSupportedBrowser;
    const supportedIOS = isSupportedIOS();
    return supportedBrowser && supportedIOS;
  };

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

  useEffect(() => {
    if (!isSupported || permission !== "granted") {
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        });

        console.log("FCM 토큰:", token);
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
