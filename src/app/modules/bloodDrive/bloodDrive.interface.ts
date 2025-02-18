export type IBloodDrive = {
  id: string;
  title: string;
  userId: string;
  user?: { connect: { id: string } }; // Allow user relation
  division: string;
  district: string;
  upazila: string;
  address: string;
  organizer: string;
  date: Date;
  banner?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IBloodDriveFilters = {
  searchTerm?: string;
  organizer?: string;
  startDate?: Date;
  endDate?: Date;
};
