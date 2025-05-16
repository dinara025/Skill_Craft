importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
   importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

   firebase.initializeApp({
       apiKey: "AIzaSyCCVFX1baxMP6PH6jbhWTE2xh-gU8ejAPo",
       authDomain: "skillcraft-b0e66.firebaseapp.com",
       projectId: "skillcraft-b0e66",
       storageBucket: "skillcraft-b0e66.firebasestorage.app",
       messagingSenderId: "164000295985",
       appId: "1:164000295985:web:9306ae0fa79bd4452b3910"
   });

   const messaging = firebase.messaging();

   messaging.onBackgroundMessage((payload) => {
       console.log('[firebase-messaging-sw.js] Received background message ', payload);
       const notificationTitle = payload.notification.title;
       const notificationOptions = {
           body: payload.notification.body,
           icon: '/skill_craft_logo.png'
       };

       self.registration.showNotification(notificationTitle, notificationOptions);
   });