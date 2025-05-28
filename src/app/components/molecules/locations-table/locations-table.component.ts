import { Component, Input } from '@angular/core';
import { LocationResponse } from 'src/app/shared/dtos/location-response.model';

@Component({
  selector: 'app-locations-table',
  templateUrl: './locations-table.component.html',
  styleUrls: ['./locations-table.component.scss'],
})
export class LocationsTableComponent {
  @Input() locations: LocationResponse[] = [];
}
