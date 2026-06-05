export type UserRole = "player" | "admin";

export function isAdminRole(role: string | null | undefined): boolean {
  return role === "admin";
}
