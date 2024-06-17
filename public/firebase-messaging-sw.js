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

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
