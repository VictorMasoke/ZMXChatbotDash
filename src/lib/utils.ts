import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_superadmin?: boolean;
  };
}

export interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  bio?: string;
  is_active: boolean;
  is_superadmin: boolean;
  token_exp?: number;
}
