importScripts("https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyDbw15pdmae6rnpwYkCXlTuIq1AJahmsyg",
  authDomain: "gachi-myeonjeob.firebaseapp.com",
  projectId: "gachi-myeonjeob",
  storageBucket: "gachi-myeonjeob.appspot.com",
  messagingSenderId: "1013024533440",
  appId: "1:1013024533440:web:e5a6157dcf86451c4cb625",
  measurementId: "G-8529WYLE5Y",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

function getUserId() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("userIdDB", 1);

    request.onerror = () => {
      reject("IndexedDB access error");
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["userIdStore"], "readonly");
      const store = transaction.objectStore("userIdStore");
      const getRequest = store.get("userId");

      getRequest.onerror = () => {
        reject("Error reading userId from IndexedDB");
      };

      getRequest.onsuccess = () => {
        resolve(getRequest.result);
      };
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore("userIdStore");
    };
  });
}

messaging.onBackgroundMessage(async (payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);

  const userId = await getUserId();
  console.log("userId: ", userId);

  const message = payload.notification?.body;
  console.log("message: ", message);

  const match = message?.match(/.*\((\d+)\)$/);
  const number = match ? parseInt(match[1], 10) : null;

  if (number && number === userId) {
    const messageWithoutUserId = message.replace(`(${number})`, "");
    const notificationTitle = payload.notification.title;

    const notificationOptions = {
      body: messageWithoutUserId,
      icon: "/logo.png",
    };

    console.log("Displaying notification:", notificationTitle);

    self.registration.getNotifications().then((notifications) => {
      notifications.forEach((notification) => {
        notification.close();
      });
      self.registration.showNotification(notificationTitle, notificationOptions);
    });
  }
});
