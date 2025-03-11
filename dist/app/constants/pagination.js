"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bloodDrivePaginationFields = exports.bloodRequestPaginationFields = exports.paginationFields = void 0;
exports.paginationFields = ["page", "limit", "sortBy", "sortOrder"];
exports.bloodRequestPaginationFields = [
    ...exports.paginationFields,
    "blood",
    "urgency",
    "status",
];
exports.bloodDrivePaginationFields = [
    ...exports.paginationFields,
    "organizer",
    "startDate",
    "endDate",
];
