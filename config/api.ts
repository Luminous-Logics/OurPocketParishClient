
const AUTH = {
  AUTH_LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  GENERATE_REFRESH_TOKEN: "/auth/refresh-token",
  PROFILE: "/auth/profile",
};

const ROLES = {
  PERMISSIONS: {
    ALL: "/roles/permissions/all",
  },
};

const FAMILIES = {
  LIST: "/families/parish/:parishId",
  SEARCH: "/families/parish/:parishId/search",
  ALL: "/families/parish/:parishId/all",
  BY_WARD: "/families/ward/:wardId",
  CREATE: "/families", // New endpoint for creating families
  GET_BY_ID: "/families/:id", // New endpoint for getting family by ID
};

const PRAYER_REQUESTS = {
  ACTIVE: "/prayer-requests/parish/:parishId/active",
  PAST: "/prayer-requests/parish/:parishId/past",
  APPROVE: "/prayer-requests/:prayerRequestId/approve",
  CLOSE: "/prayer-requests/:prayerRequestId/close",
  CREATE: "/prayer-requests",
};

const WARDS = {
  LIST: "/wards/parish/:parishId",
  GET_ALL_BY_PARISH: "/wards/parish", // Assuming this endpoint exists or will be created
  SEARCH: "/wards/parish/:parishId/search",
  CREATE: "/wards",
  UPDATE: "/wards",
};

const PARISHIONERS = {
  BY_FAMILY: "/parishioners/family/:familyId",
  CREATE: "/parishioners",
};
const PARISH = {
  LIST: "/parishes",
  DETAILS: (parishId: string) => `/parishes/${parishId}`,
};
export const API_ENDPOINTS = {
  AUTH,
  ROLES,
  FAMILIES,
  PRAYER_REQUESTS,
  WARDS,
  PARISHIONERS,
  PARISH
};
