export interface User {
  id: string;
  userName: string;
  email: string;
  roles: string[];
  birthDate?: string;
  lastName?: string;
  gender?: string;
  createdAt?: string;
}
