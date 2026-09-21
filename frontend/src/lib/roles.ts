export const isManager = (role?: string) =>
  role === "OWNER" || role === "ADMIN";

export const homeFor = (role?: string) =>
  isManager(role) ? "/dashboard" : "/transaction";

// pages staff can't open (keep in sync with the `roles` in your Navigation)
export const managerOnly = ["/dashboard", "/products", "/logbook"];
