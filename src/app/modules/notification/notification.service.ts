import { PrismaClient } from "@prisma/client";
import webpush from "web-push";
import prisma from "../../shared/prisma";


export async function subscribe(
  userId: string,
  subscription: webpush.PushSubscription
) {
  await prisma.subscription.create({
    data: {
      userId,
      endpoint: subscription.endpoint,
      auth: subscription.keys.auth,
      p256dh: subscription.keys.p256dh,
    },
  });
}

export async function sendNotification(
  userId: string,
  title: string,
  body: string,
  url?: string
) {
  const subscriptions = await prisma.subscription.findMany({
    where: { userId },
  });

  const notification = await prisma.notification.create({
    data: {
      userId,
      title,
      body,
      url,
    },
  });

  const payload = JSON.stringify({
    title,
    body,
    url,
    notificationId: notification.id,
  });

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            auth: sub.auth,
            p256dh: sub.p256dh,
          },
        },
        payload
      );
    } catch (error) {
      console.error("Error sending notification:", error);
      // If the subscription is no longer valid, remove it
      if ((error as { statusCode: number }).statusCode === 410) {
        await prisma.subscription.delete({ where: { id: sub.id } });
      }
    }
  }
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
export const synceNotifications = async (
  userId: string,
  title: string,
  body: string,
  url?: string
) => {
  await prisma.notification.create({
    data: {
      userId: userId,
      title,
      body,
      url,
    },
  });
};
