import { User } from './user.model';

export interface Role {
  id?: number;
  name: string;
  description?: string;

  users: User[];
}
