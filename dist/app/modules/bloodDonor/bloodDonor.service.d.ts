import { type BloodDonor } from "@prisma/client";
import type { IBloodDonor, IBloodDonorFilters } from "./bloodDonor.interface";
import { IPaginationOptions } from "../../interface/pagination";
import { IGenericResponse } from "../../interface/common";
export declare const BloodDonorService: {
    getAllBloodDonors: (filters: IBloodDonorFilters, paginationOptions: IPaginationOptions) => Promise<IGenericResponse<BloodDonor[]>>;
    getBloodDonorById: (id: string) => Promise<BloodDonor | null>;
    createBloodDonor: (bloodDonorData: IBloodDonor) => Promise<BloodDonor>;
    updateBloodDonor: (id: string, payload: Partial<IBloodDonor>) => Promise<BloodDonor>;
    deleteBloodDonor: (id: string) => Promise<BloodDonor>;
};
