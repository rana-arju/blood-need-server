import { type Review } from "@prisma/client";
import type { IReview, IReviewFilters } from "./review.interface";
import { IPaginationOptions } from "../../interface/pagination";
import { IGenericResponse } from "../../interface/common";
export declare const ReviewService: {
    getAllReviews: (filters: IReviewFilters, paginationOptions: IPaginationOptions) => Promise<IGenericResponse<Review[]>>;
    getReviewById: (id: string) => Promise<Review | null>;
    createReview: (reviewData: IReview, id: string) => Promise<Review>;
    updateReview: (id: string, payload: Partial<IReview>) => Promise<Review>;
    deleteReview: (id: string) => Promise<Review>;
};
