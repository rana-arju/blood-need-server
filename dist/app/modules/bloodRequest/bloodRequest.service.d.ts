import { type BloodRequest } from "@prisma/client";
import type { IBloodRequest, IBloodRequestFilters } from "./bloodRequest.interface";
import { IPaginationOptions } from "../../interface/pagination";
import { IGenericResponse } from "../../interface/common";
export declare const createBloodRequest: (bloodRequestData: any) => Promise<any>;
export declare const BloodRequestService: {
    getAllBloodRequests: (filters: IBloodRequestFilters, paginationOptions: IPaginationOptions) => Promise<IGenericResponse<BloodRequest[]>>;
    getBloodRequestById: (id: string) => Promise<BloodRequest | null>;
    createBloodRequest: (bloodRequestData: any) => Promise<any>;
    updateBloodRequest: (id: string, payload: Partial<IBloodRequest>) => Promise<BloodRequest>;
    deleteBloodRequest: (id: string) => Promise<BloodRequest>;
};
