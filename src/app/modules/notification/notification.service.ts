import prisma from "../../shared/prisma";
import { webpush } from "./webpush.service";
function isValidSubscription(sub: any): boolean {
  console.log("Validating subscription:", sub);
  const isValid =
    sub &&
    typeof sub.endpoint === "string" &&
    sub.endpoint.startsWith("https://") &&
    sub.auth &&
    typeof sub.auth === "string" &&
    sub.p256dh &&
    typeof sub.p256dh === "string";

  if (!isValid) {
    console.log("Invalid subscription details:", {
      hasEndpoint: !!sub.endpoint,
      endpointIsString: typeof sub.endpoint === "string",
      endpointStartsWithHttps: sub.endpoint?.startsWith("https://"),
      hasAuth: !!sub.auth,
      authIsString: typeof sub.auth === "string",
      hasP256dh: !!sub.p256dh,
      p256dhIsString: typeof sub.p256dh === "string",
    });
  }

  return isValid;
}

export async function subscribe(
  userId: string,
  subscription: webpush.PushSubscription
) {
  const isExist = await prisma.subscription.findFirst({
    where: {
      userId,
      endpoint: subscription.endpoint,
    },
  });

  if (isExist) {
    return { message: "Already subscribed." };
  }
  await prisma.subscription.create({
    data: {
      userId,
      endpoint: subscription.endpoint,
      auth: subscription.keys.auth,
      p256dh: subscription.keys.p256dh,
    },
  });
  return { message: "Subscription successful." };
}

export async function sendNotification(
  userIds: string[],
  title: string,
  body: string,
  url?: string
) {
  const notifications = await prisma.notification.createMany({
    data: userIds.map((userId) => ({
      title,
      body,
      url,
      userId,
    })),
  });
  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId: {
        in: userIds,
      },
    },
  });

  const payload = JSON.stringify({
    title,
    body,
    url,
  });

  const sendPromises = subscriptions.map(async (sub) => {
    console.log("Sending notification to subscription:", sub.endpoint);
    if (!isValidSubscription(sub)) {
      console.log("Invalid subscription, skipping:", sub.id);
      return;
    }
    console.log("Sending notification to subscription:", sub.endpoint);
    try {
      const webpushRes = await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            auth: sub.auth,
            p256dh: sub.p256dh,
          },
        },
        payload
      );
      console.log("Notification sent successfully:", webpushRes);
    } catch (error: any) {
      console.error("Error sending notification:", {
        statusCode: error.statusCode,
        headers: error.headers,
        body: error.body,
        endpoint: sub.endpoint,
      });
      if (error.statusCode === 410) {
        console.log("Deleting expired subscription:", sub.id);
        await prisma.subscription.delete({ where: { id: sub.id } });
      }
    }
  });

  await Promise.all(sendPromises);
    return notifications;

}

export async function getUnreadNotifications(userId: string) {
  return prisma.notification.findMany({
    where: {
      userId,
      isRead: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function markNotificationAsRead(notificationId: string) {
  await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
}

export async function sendNotificationToMatchingDonors(bloodRequest: any) {
  const matchingDonors = await prisma.user.findMany({
    where: {
      blood: bloodRequest.blood,
      district: bloodRequest.district,
      //donorInfo: {isNot: null},
    },
    select: {
      id: true,
    },
  });

  const donorIds = matchingDonors.map((donor) => donor.id);

  if (donorIds.length > 0) {
    const title = "Urgent Blood Request";
    const body = `A ${bloodRequest.blood} blood donation is needed in ${bloodRequest.district}.`;
    const url = `/request/${bloodRequest.id}`;

    await sendNotification(donorIds, title, body, url);
  }
}
