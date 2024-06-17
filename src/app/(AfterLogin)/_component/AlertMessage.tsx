"use client";

import { messaging, isSupportedBrowser, isSupportedIOS } from "@/firebase";
import { userIdState } from "@/store/auth";
import { onMessage } from "firebase/messaging";
import Link from "next/link";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRecoilValue } from "recoil";

export default function AlertMessage() {
  const userId = useRecoilValue(userIdState);

  useEffect(() => {
    // 임시로 작성한 코드입니다.
    // 브라우저 지원 여부 확인 후 알림 메시지를 받아옵니다. 모바일 환경에서 에러가 발생하는 것을 방지합니다.
    // 에러 메세지: Application error: a client-side exception has occurred (see the browser console for more information).
    const browserCheck = async () => {
      if (!(await isSupportedBrowser) || !isSupportedIOS()) {
        // return;
      }
      if (!messaging) {
        console.log("messaging is not initialized", messaging);
        // return;
      }

      onMessage(messaging, (payload) => {
        const message = payload.notification?.body;
        const match = message?.match(/.*\((\d+)\)$/);
        const number = match ? parseInt(match[1], 10) : null;

        if (number && number === userId) {
          toast.info(payload.notification?.body);
        }
      });
    };

    browserCheck();
    // 여기까지 06.04 임시로 작성했습니다. 사용자가 브라우저에서 알림을 허용했는지 확인하는 코드

    // 기존 코드
    // onMessage(messaging, (payload) => {
    //   const message = payload.notification?.body;
    //   const match = message?.match(/.*\((\d+)\)$/);
    //   const number = match ? parseInt(match[1], 10) : null;

    //   if (number && number === userId) {
    //     toast.info(payload.notification?.body);
    //   }
    // });
  }, [userId]);
  return (
    <Link href="/alerts">
      <ToastContainer position="top-right" autoClose={8000} />
    </Link>
  );
}
