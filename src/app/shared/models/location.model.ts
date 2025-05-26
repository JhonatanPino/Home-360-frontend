import { City } from './city.model';

export interface Location {
  id?: number;
  sector: string;

  city: City;
}
