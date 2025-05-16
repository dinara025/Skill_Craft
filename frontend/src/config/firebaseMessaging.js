import { messaging } from './firebase';
   import { getToken, onMessage } from 'firebase/messaging';
   import axios from 'axios';

   export const requestNotificationPermission = async (userId) => {
       try {
           const permission = await Notification.requestPermission();
           if (permission === 'granted') {
               console.log('Notification permission granted.');
               const token = await getToken(messaging, {
                   vapidKey: 'BMLPrHMKJoWULDZwrnVNRX7-MNYXUNHgtJ5-WhekB74iiTBvCcc5K-QfN_NpUwVEzIyQ2pvgpY1X1oqtGBPUxk4'
               });
               if (token) {
                   console.log('FCM Token:', token);
                   await axios.post(
                       'http://localhost:8080/api/notifications/register-token',
                       { userId, token },
                       {
                           headers: {
                               Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                           }
                       }
                   );
                   return token;
               } else {
                   console.log('No registration token available.');
               }
           } else {
               console.log('Notification permission denied.');
           }
       } catch (err) {
           console.error('Error getting FCM token:', err);
       }
   };

   export const onMessageListener = () =>
       new Promise((resolve) => {
           onMessage(messaging, (payload) => {
               console.log('Foreground message received:', payload);
               resolve(payload);
           });
       });