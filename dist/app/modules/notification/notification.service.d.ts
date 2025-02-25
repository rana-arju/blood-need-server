import { webpush } from "./webpush.service";
export declare function subscribe(userId: string, subscription: webpush.PushSubscription): Promise<{
    message: string;
}>;
export declare function sendNotification(userIds: string[], title: string, body: string, url?: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
export declare function getUnreadNotifications(userId: string): Promise<(import("@prisma/client/runtime").GetResult<{
    id: string;
    userId: string;
    title: string;
    body: string;
    url: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}, unknown, never> & {})[]>;
export declare function markNotificationAsRead(notificationId: string): Promise<void>;
export declare function sendNotificationToMatchingDonors(bloodRequest: any): Promise<void>;
