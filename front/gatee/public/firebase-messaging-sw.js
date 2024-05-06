
self.addEventListener("install", function (e) {
  console.log("FCM Service Worker install..");
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  console.log("FCM Service Worker activate..");
});

// 푸시 알림 받는 설정
self.addEventListener("push", function (e) {
  console.log("푸시 알림 왔다!!!!!: ", e.data.json());
  if (!e.data.json()) return;

  const resultData = e.data.json().notification;
  const notificationTitle = resultData.title;
  const notificationOptions = {
    body: resultData.body,
    icon: resultData.image,
    tag: resultData.tag,
    ...resultData,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  console.log("Notification clicked");
  const clickedNotification = event.notification;
  clickedNotification.close();

  const pushPath = '/main';
  console.log("알림 클릭 시, 페이지 이동 : " + pushPath);

  // 클라이언트 측에서 해당 경로로 이동
  event.waitUntil(
    self.clients.openWindow(pushPath)
  );
});


// 백그라운드 메세지 두번 오는 문제 때문에 주석처리
// importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
//
// firebase.initializeApp({
//   apiKey: "AIzaSyCiiaCQgXFvOYDt5jzzRIHwnhC_kCJ5op8",
//   authDomain: "gatee-bf33f.firebaseapp.com",
//   projectId: "gatee-bf33f",
//   storageBucket: "gatee-bf33f.appspot.com",
//   messagingSenderId: "1009013790999",
//   appId: "1:1009013790999:web:e4273021380c2598cd7f52",
//   measurementId: "G-5T6L10CXW3"
// });
//
// const messaging = firebase.messaging()
//
//
// // 백그라운드 메세지
// messaging.onBackgroundMessage((payload) => {
//   console.log('[firebase-messaging-sw.js] 백그라운드 메세지 도착 ', payload);
//   // Customize notification here
//   const notificationTitle = 'Background Message Title';
//   const notificationOptions = {
//     body: 'Background Message body.',
//     icon: '/app_icon.png'
//   };
//
//   self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });
