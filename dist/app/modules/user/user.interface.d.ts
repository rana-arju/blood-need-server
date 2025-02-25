export type IUser = {
    id?: string;
    name: string;
    email: string;
    role: "user" | "admin" | "superadmin" | "volunteer";
    status?: "active" | "blocked";
    password?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type IUserFilters = {
    searchTerm?: string;
    bloodType?: string;
};
