export type IDonation = {
    id: string;
    userId: string;
    date: Date;
    amount: number;
    location: string;
    createdAt: Date;
    updatedAt: Date;
};
export type IDonationFilters = {
    searchTerm?: string;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
};
