export const paginationFields = ["page", "limit", "sortBy", "sortOrder"];

export const bloodRequestPaginationFields = [
  ...paginationFields,
  "blood",
  "urgency",
  "status",
];

export const bloodDrivePaginationFields = [
  ...paginationFields,
  "organizer",
  "startDate",
  "endDate",
];
