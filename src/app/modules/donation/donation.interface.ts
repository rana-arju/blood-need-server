export interface IDonationOffer {
  id: string;
  userId: string;
  bloodRequestId: string;
  status: "pending" | "selected" | "cancelled" | "confirmed";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IDonationOfferFilters = {
  status?: "pending" | "selected" | "cancelled" | "confirmed";
  bloodRequestId?: string;
  userId?: string;
};
