import { UserRole } from './enums';

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
  tokenType: 'access' | 'refresh';
}

export interface AuthenticatedUser {
  userId: number;
  email: string;
  role: UserRole;
  permissions: string[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    role: UserRole;
    permissions: string[];
  };
}
