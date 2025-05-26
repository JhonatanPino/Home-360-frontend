import { City } from './city.model';

export interface Department {
  id?: number;
  name: string;
  description: string;

  cities: City[];
}
