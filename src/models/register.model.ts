export interface RegisterModel {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  gender: boolean;
  birthDate: string; // ممكن تبقى Date لو بتستخدم Date object
}
