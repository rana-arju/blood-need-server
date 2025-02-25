import { type BloodDrive } from "@prisma/client";
import type { IBloodDrive, IBloodDriveFilters } from "./bloodDrive.interface";
import { IPaginationOptions } from "../../interface/pagination";
import { IGenericResponse } from "../../interface/common";
export declare const BloodDriveService: {
    getAllBloodDrives: (filters: IBloodDriveFilters, paginationOptions: IPaginationOptions) => Promise<IGenericResponse<BloodDrive[]>>;
    getBloodDriveById: (id: string) => Promise<BloodDrive | null>;
    createBloodDrive: (bloodDriveData: Omit<IBloodDrive, "userId"> & {
        user: {
            connect: {
                id: string;
            };
        };
    }) => Promise<BloodDrive>;
    updateBloodDrive: (id: string, payload: Partial<IBloodDrive>) => Promise<BloodDrive>;
    deleteBloodDrive: (id: string) => Promise<BloodDrive>;
};
