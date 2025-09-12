export const Role = {
  SUPER_ADMIN: 1,
  ADMINISTRATOR: 2,
  ADMIN_SUPPORT: 3,
  MANAGER: 4,
  LEAD_SUPERVISOR: 10,
  SUPERVISOR: 5,
  SITE_SUPERVISOR: 6,
  STORE: 7,
  WORKER: 8,
  FREELANCE: 9,
  OTHERS: 11,
};

export const RoleName = {
  [Role.SUPER_ADMIN]: "Super Admin",
  [Role.ADMINISTRATOR]: "Administrator",
  [Role.ADMIN_SUPPORT]: "Admin Support",
  [Role.MANAGER]: "Manager",
  [Role.LEAD_SUPERVISOR]:"Lead Supervisor",
  [Role.SUPERVISOR]: "Office Supervisor",
  [Role.SITE_SUPERVISOR]: "Site Supervisor",
  [Role.STORE]: "Store",
  [Role.WORKER]: "Worker",
  [Role.FREELANCE]: "Freelance",
  [Role.OTHERS]:"Others"
};

export const Roles = Object.entries(RoleName).map(([value, label]) => ({
  label,
  value: Number(value),
}));
