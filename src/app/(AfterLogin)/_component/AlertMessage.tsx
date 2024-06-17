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
