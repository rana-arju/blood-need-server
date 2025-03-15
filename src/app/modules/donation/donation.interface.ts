export interface IDonationOffer {
  id: string;
  userId: string;
  bloodRequestId: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IDonationOfferFilters = {
  status?: "pending" | "accepted" | "rejected" | "completed";
  bloodRequestId?: string;
  userId?: string;
};
