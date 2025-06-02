import { Category } from './category.model';
import { Location } from './location.model';
import { PublicationStatus } from '../enums/publication-status.model';

export interface Home {
  id?: number;
  name: string;
  description: string;
  rooms: number;
  bathrooms: number;
  price: number;
  publicationDate: Date;
  publicationDateActive: Date;
  status: PublicationStatus;

  category: Category;
  location: Location;
}
