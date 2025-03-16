export interface IHealthRecord {
  id?: string;
  userId: string;
  date: Date;
  hemoglobin: number;
  bloodPressure: string;
  weight: number;
  height?: number;
  pulse?: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IHealthRecordResponse extends IHealthRecord {
  user?: {
    id: string;
    name: string;
    email: string;
    blood?: string;
    dateOfBirth?: Date;
    lastDonationDate?: Date;
    donationCount: number;
    donorInfo?: {
      id: string;
      height?: number;
      weight?: number;
      medicalCondition?: string;
      currentMedications?: string;
    };
  };
}

export interface IHealthRecordUpdateData {
  // Health record fields
  date?: Date;
  hemoglobin?: number;
  bloodPressure?: string;
  weight?: number;
  height?: number;
  pulse?: number;
  notes?: string;

  // User fields that might be updated
  blood?: string;
  dateOfBirth?: Date;
  lastDonationDate?: Date;
}
