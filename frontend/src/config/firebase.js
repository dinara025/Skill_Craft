import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
       apiKey: "AIzaSyCCVFX1baxMP6PH6jbhWTE2xh-gU8ejAPo",
       authDomain: "skillcraft-b0e66.firebaseapp.com",
       projectId: "skillcraft-b0e66",
       storageBucket: "skillcraft-b0e66.firebasestorage.app",
       messagingSenderId: "164000295985",
       appId: "1:164000295985:web:9306ae0fa79bd4452b3910"
   };

   const app = initializeApp(firebaseConfig);
   const storage = getStorage(app);
   const messaging = getMessaging(app);

   export { storage, messaging };