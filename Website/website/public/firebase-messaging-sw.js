importScripts(
  "https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCW5KPEnDpKwYUfGNGqItabVL_RTeIZlD8",
  authDomain: "final-47642.firebaseapp.com",
  projectId: "final-47642",
  messagingSenderId: "1048641007716",
  appId: "1:1048641007716:web:ae669d3634a83ca982ef71",
};

firebase.initializeApp(firebaseConfig);

class CustomPushEvent extends Event {
  constructor(data) {
    super("push");

    Object.assign(this, data);
    this.custom = true;
  }
}

self.addEventListener("push", (e) => {
  if (e.custom) return;

  const oldData = e.data;
  const newEvent = new CustomPushEvent({
    data: {
      ehheh: oldData.json(),
      json() {
        const newData = oldData.json();
        newData.data = {
          ...newData.data,
          ...newData.notification,
        };
        delete newData.notification;
        return newData;
      },
    },
    waitUntil: e.waitUntil.bind(e),
  });
  e.stopImmediatePropagation();

  dispatchEvent(newEvent);
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const channel = new BroadcastChannel("sw-messages");
  channel.postMessage(payload.data);
  console.log("Received background message:", payload.data);
});
