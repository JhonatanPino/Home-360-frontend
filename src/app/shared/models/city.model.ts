import { Department } from './department.model';

export interface City {
  id?: number;
  name: string;
  description: string;

  department: Department;
  locations: Location[];
}
