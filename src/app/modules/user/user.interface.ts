export type IUser = {
  id?: string;
  name: string;
  email: string;
  role: string;
  password?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type IUserFilters = {
  searchTerm?: string
  bloodType?: string
}

