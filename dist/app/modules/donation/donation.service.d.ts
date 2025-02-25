import { type Donation } from "@prisma/client";
import type { IDonation, IDonationFilters } from "./donation.interface";
import { IPaginationOptions } from "../../interface/pagination";
import { IGenericResponse } from "../../interface/common";
export declare const DonationService: {
    getAllDonations: (filters: IDonationFilters, paginationOptions: IPaginationOptions) => Promise<IGenericResponse<Donation[]>>;
    createDonation: (donationData: IDonation) => Promise<Donation>;
    updateDonation: (id: string, payload: Partial<IDonation>) => Promise<Donation>;
    deleteDonation: (id: string) => Promise<Donation>;
};
