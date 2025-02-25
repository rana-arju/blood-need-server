import { type Volunteer } from "@prisma/client";
import type { IVolunteer } from "./volunteer.interface";
export declare const VolunteerService: {
    getVolunteerById: (id: string) => Promise<Volunteer | null>;
    createVolunteer: (volunteerData: IVolunteer) => Promise<Volunteer>;
    updateVolunteer: (id: string, payload: Partial<IVolunteer>) => Promise<Volunteer>;
    deleteVolunteer: (id: string) => Promise<Volunteer>;
};
