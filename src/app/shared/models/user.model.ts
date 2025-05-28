import { Role } from './role.model';

export interface User {
  id?: number;
  name: string;
  lastName: string;
  documentNumber: string;
  phone: string;
  birthDate: Date;
  email: string;
  password: string;

  role: Role;
}
