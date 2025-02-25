export type IBloodDonor = {
    id: string;
    userId: string;
    phone: string;
    whatsappNumber: string;
    facebookId: string;
    blood: string;
    dateOfBirth: Date;
    gender: string;
    height: number;
    weight: number;
    division: string;
    district: string;
    upazila: string;
    address: string;
    lastDonationDate: Date;
    emergencyContact: string;
    medicalCondition?: string;
    currentMedications?: string;
    createdAt: Date;
    updatedAt: Date;
};
export type IBloodDonorFilters = {
    searchTerm?: string;
    eligibleToDonateSince?: Date;
};
