export const Role = {
  SUPER_ADMIN: 1,
  ADMINISTRATOR: 2,
  ADMIN_SUPPORT: 3,
  MANAGER: 4,
  SUPERVISOR: 5,
  SITE_SUPERVISOR: 6,
  STORE: 7,
  WORKER: 8,
  FREELANCE: 9,
};

export const RoleName = {
  [Role.SUPER_ADMIN]: "Super Admin",
  [Role.ADMINISTRATOR]: "Administrator",
  [Role.ADMIN_SUPPORT]: "Admin Support",
  [Role.MANAGER]: "Manager",
  [Role.SUPERVISOR]: "Supervisor",
  [Role.SITE_SUPERVISOR]: "Site Supervisor",
  [Role.STORE]: "Store",
  [Role.WORKER]: "Worker",
  [Role.FREELANCE]: "Freelance",
};

export const Roles = Object.entries(RoleName).map(([value, label]) => ({
  label,
  value: Number(value),
}));
