import webpush from "web-push";
import config from "../../config";
import prisma from "../../shared/prisma";
import { logger } from "../../shared/logger";
import AppError from "../../error/AppError";

// Set VAPID details
webpush.setVapidDetails(
  `mailto:${config.email.from}`,
  config.vapid.publicKey,
  config.vapid.privateKey
);

const saveSubscription = async (userId: string, subscription: any) => {
  const { endpoint, keys } = subscription.subscription; // Correctly access the nested subscription object
  try {
    if (!endpoint || !keys?.auth || !keys?.p256dh) {
      throw new AppError(400, "Invalid subscription");
    }

    const existingSubscription = await prisma.subscription.findFirst({
      where: { endpoint },
    });

    if (existingSubscription !== null) {
      const result = await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          userId,
          auth: keys.auth,
          p256dh: keys.p256dh,
          updatedAt: new Date(),
        },
      });
      return result;
    }

    const result = await prisma.subscription.create({
      data: {
        userId,
        endpoint,
        auth: keys.auth,
        p256dh: keys.p256dh,
      },
    });
    return result;
  } catch (error) {
    console.error("Error occurred while saving subscription:", error); // Log the actual error
    throw new AppError(500, "Failed to save web push subscription");
  }
};


// Delete web push subscription
const deleteSubscription = async (endpoint: string): Promise<any> => {
  return await prisma.subscription.deleteMany({
    where: {
      endpoint,
    },
  });
};

// Send web push notification
const sendPushNotification = async (
  subscription: webpush.PushSubscription,
  payload: any
): Promise<any> => {
  try {
    return await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    );
  } catch (error: any) {
    logger.error("Error sending web push notification:", error);

    // If subscription is expired or invalid, delete it
    if (error.statusCode === 404 || error.statusCode === 410) {
      try {
        await deleteSubscription(subscription.endpoint);
      } catch (deleteError) {
        logger.error("Error deleting invalid subscription:", deleteError);
      }
    }

    throw error;
  }
};

// Send notification to all subscriptions for a user
const sendNotificationToUser = async (
  userId: string,
  payload: any
): Promise<any> => {
  const subscriptions = await prisma.subscription.findMany({
    where: { userId },
  });

  if (subscriptions.length === 0) {
    return { success: 0, failure: 0 };
  }

  const results = await Promise.allSettled(
    subscriptions.map((sub) => {
      const subscription: webpush.PushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          auth: sub.auth,
          p256dh: sub.p256dh,
        },
      };

      return sendPushNotification(subscription, payload);
    })
  );

  const success = results.filter((r) => r.status === "fulfilled").length;
  const failure = results.filter((r) => r.status === "rejected").length;

  return { success, failure };
};

// Send notification to all users in a district
const sendNotificationToDistrict = async (
  district: string,
  payload: any
): Promise<any> => {
  // Find all users in the district
  const users = await prisma.user.findMany({
    where: { district },
    select: { id: true },
  });

  if (users.length === 0) {
    return { success: 0, failure: 0 };
  }

  const userIds = users.map((user) => user.id);

  // Find all subscriptions for these users
  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId: {
        in: userIds,
      },
    },
  });

  if (subscriptions.length === 0) {
    return { success: 0, failure: 0 };
  }

  const results = await Promise.allSettled(
    subscriptions.map((sub) => {
      const subscription: webpush.PushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          auth: sub.auth,
          p256dh: sub.p256dh,
        },
      };

      return sendPushNotification(subscription, payload);
    })
  );

  const success = results.filter((r) => r.status === "fulfilled").length;
  const failure = results.filter((r) => r.status === "rejected").length;

  return { success, failure };
};

export const WebPushService = {
  saveSubscription,
  deleteSubscription,
  sendPushNotification,
  sendNotificationToUser,
  sendNotificationToDistrict,
};
