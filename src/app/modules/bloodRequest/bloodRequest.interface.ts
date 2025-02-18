export interface IBloodRequest {
  id: string;
  userId: string;
  patientName: string;
  blood: string;
  hospitalName: string;
  contactNumber: string;
  whatsappNumber?: string;
  bloodAmount: number;
  division: string;
  district: string;
  upazila: string;
  address: string;
  requiredDate: Date;
  requireTime: Date;
  hemoglobin?: number;
  patientProblem?: string;
  reference?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IBloodRequestFilters = {
  searchTerm?: string;
  bloodType?: string;
  urgency?: "low" | "medium" | "high";
  status?: "pending" | "fulfilled" | "cancelled";
};
