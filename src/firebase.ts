import { initializeApp } from "firebase/app";
import { Messaging, getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export let messaging: Messaging;
// 이전 코드
// messaging = getMessaging(app);

// 브라우저 지원 여부를 확인합니다.
export const isSupportedBrowser = isSupported();
// IOS만 따로 지원 여부를 확인합니다. (IOS는 PWA에서만 사용 가능인데 isSupported에서는 사용 불가능한 경우도 포함되어 있습니다.)
export const isSupportedIOS = () => {
  if (typeof window !== "undefined" && typeof navigator !== "undefined") {
    return "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;
  }
  return false;
};

// 브라우저가 지원하는 경우에만 messaging을 바인딩합니다.
// 브라우저가 지원하지 않는 경우, messaging은 undefined입니다.
isSupportedIOS() &&
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
      console.log("messaging is initialized", messaging);
    }
  });

// 원래부터 주석처리되어있던 코드
// export const requestPermission = async () => {
//   console.log("Requesting permission...");
//   const permission = await Notification.requestPermission();
//   if (permission === "granted") {
//     console.log("Notification permission granted.");
//     await getToken(messaging, {
//       vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
//     });
//   } else {
//     console.log("No registration token available. Request permission to generate one.");
//   }
// };
