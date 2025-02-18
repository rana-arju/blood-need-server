export const paginationFields = ["page", "limit", "sortBy", "sortOrder"];

export const bloodRequestPaginationFields = [
  ...paginationFields,
  "bloodType",
  "urgency",
  "status",
];

export const bloodDrivePaginationFields = [
  ...paginationFields,
  "organizer",
  "startDate",
  "endDate",
];
