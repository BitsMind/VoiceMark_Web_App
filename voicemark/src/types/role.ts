export const UserTypes = ["USER", "PRO", "ADMIN"] as const;

export type UserType = (typeof UserTypes)[number];

export interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
}
