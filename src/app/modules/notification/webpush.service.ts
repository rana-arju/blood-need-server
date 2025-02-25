import webpush from "web-push";

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (!vapidPublicKey || !vapidPrivateKey) {
  console.error("VAPID keys are not set. Push notifications will not work.");
} else {
  console.log("Setting VAPID details with public key:", vapidPublicKey);
  webpush.setVapidDetails(
    "mailto:ranaarju20@gmail.com",
    vapidPublicKey,
    vapidPrivateKey
  );
}

export { webpush };
