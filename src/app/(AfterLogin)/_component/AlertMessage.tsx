"use client";

import { messaging } from "@/firebase";
import { userIdState } from "@/store/auth";
import { onMessage } from "firebase/messaging";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRecoilValue } from "recoil";

export default function AlertMessage() {
  const userId = useRecoilValue(userIdState);

  useEffect(() => {
    // 메세징이 바인딩 되었을 경우에만 onMessage 이벤트가 동작해야합니다.
    // 에러 메세지: Application error: a client-side exception has occurred (see the browser console for more information).
    if (!messaging) {
      return;
    }

    onMessage(messaging, (payload) => {
      const message = payload.notification?.body;
      const match = message?.match(/.*\((\d+)\)$/);
      const number = match ? parseInt(match[1], 10) : null;

      if (number && number === userId) {
        toast.info(payload.notification?.body);
      }
    });
  }, [userId]);

  return <ToastContainer position="top-right" autoClose={8000} />;
}
