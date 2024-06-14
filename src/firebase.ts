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
export const isSupportedBrowser = isSupported();
export const isSupportedIOS =
  "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;

if (typeof window !== "undefined" && typeof window.navigator !== "undefined") {
  // messaging = getMessaging(app);

  isSupportedIOS &&
    isSupported().then((supported) => {
      if (supported) {
        messaging = getMessaging(app);
      }
    });
}

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
