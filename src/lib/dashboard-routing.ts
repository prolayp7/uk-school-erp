const DASHBOARD_DESTINATIONS: Array<{ roles: string[]; path: string }> = [
  { roles: ["SUPER_ADMIN"], path: "/dashboard/superadmin" },
  { roles: ["HEADTEACHER", "SLT"], path: "/dashboard/headteacher" },
  { roles: ["DSL", "DEPUTY_DSL"], path: "/dashboard/dsl" },
  { roles: ["SENCO", "DEPUTY_SENCO"], path: "/dashboard/senco" },
  { roles: ["ATTENDANCE_OFFICER"], path: "/attendance" },
  { roles: ["FINANCE", "ADMIN"], path: "/dashboard/finance" },
  { roles: ["MEDICAL"], path: "/dashboard/medical" },
  { roles: ["PARENT"], path: "/parents-and-carers" },
  { roles: ["STUDENT"], path: "/dashboard/student" },
  { roles: ["TEACHER"], path: "/dashboard/teacher" },
];

export function getDashboardDestination(roles: string[]): string | null {
  return DASHBOARD_DESTINATIONS.find(({ roles: allowedRoles }) =>
    allowedRoles.some((role) => roles.includes(role))
  )?.path ?? null;
}

export function hasAnyRole(roles: string[], allowedRoles: string[]): boolean {
  return allowedRoles.some((role) => roles.includes(role));
}