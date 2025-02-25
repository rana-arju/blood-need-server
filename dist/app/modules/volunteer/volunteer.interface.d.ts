export interface IVolunteer {
    id: string;
    userId: string;
    name: string;
    phone: string;
    email: string;
    division: string;
    district: string;
    upazila: string;
    address: string;
    availability: string;
    nid: string;
    skills?: string;
    createdAt: Date;
    updatedAt: Date;
}
export type IVolunteerFilters = {
    searchTerm?: string;
    skills?: string[];
    availability?: string;
};
