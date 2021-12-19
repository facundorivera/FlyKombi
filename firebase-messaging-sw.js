// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.0.0/firebase-messaging.js');


// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.

firebase.initializeApp({
    apiKey: "AIzaSyA9qle7nT73YpfWdpTi1O8Lrhi3AZy9iSk",
      authDomain: "angularpush-f0c96.firebaseapp.com",
      projectId: "angularpush-f0c96",
      storageBucket: "angularpush-f0c96.appspot.com",
      messagingSenderId: "927986775613",
      appId: "1:927986775613:web:78061c5e8d04abcb639c54"
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./firebase-messaging-sw.js')
    .then(function(registration) {
      console.log('Registration successful, scope is:', registration.scope);
    }).catch(function(err) {
      console.log('Service worker registration failed, error:', err);
    });
  }

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

console.log(messaging)



