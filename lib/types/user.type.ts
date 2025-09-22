
export type UserRole = "admin" | "teacher" | "student";

export interface User {
  _id: string;        // MongoDB ObjectId (as string)
  fullName: string;  // User's full name
  email: string;     // Unique email
  lastLogin: string;    // Last login date
  status: 'active' | 'inactive';    // User status
  password: string;  // Plain or hashed password
  role: UserRole; // User role
}