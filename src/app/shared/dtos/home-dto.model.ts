export interface HomeDto {
  name: string;
  description: string;
  rooms: number;
  bathrooms: number;
  price: number;
  publicationDate: Date;
  publicationDateActive: Date;

  idCategory: number;
  idLocation: number;
}
