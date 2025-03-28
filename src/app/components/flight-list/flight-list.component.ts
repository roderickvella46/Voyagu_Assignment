import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Flight } from '../../models/flight';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.scss']
})
export class FlightListComponent implements OnInit {
  flights: Flight[] = [];
  displayedFlights: Flight[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  sortBy: 'price' | 'departureTime' = 'price';
  sortOrder: 'asc' | 'desc' = 'asc';
  filters = {
    stops: 'all',
    priceRange: [0, 10000]
  };

  constructor(
    private flightService: FlightService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.loadFlights();
  }

  loadFlights() {
    this.flightService.getFlights().subscribe(flights => {
      this.flights = flights;
      this.applyFiltersAndSort();
    });
  }

  applyFiltersAndSort() {
    let filtered = [...this.flights];

    // Apply filters
    if (this.filters.stops !== 'all') {
      filtered = filtered.filter(flight => {
        const stops = flight.flights.length - 1;
        return this.filters.stops === 'nonstop' ? stops === 0 : stops > 0;
      });
    }

    filtered = filtered.filter(flight =>
      flight.price >= this.filters.priceRange[0] &&
      flight.price <= this.filters.priceRange[1]
    );

    // Apply sorting
    filtered.sort((a, b) => {
      if (this.sortBy === 'price') {
        return this.sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      } else {
        const timeA = new Date(a.flights[0].arrival_time).getTime();
        const timeB = new Date(b.flights[0].arrival_time).getTime();
        return this.sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      }
    });

    this.displayedFlights = filtered.slice(0, this.currentPage * this.itemsPerPage);

    console.log("displayedFlights: ", this.displayedFlights)
  }

  showMore() {
    this.currentPage++;
    this.applyFiltersAndSort();
  }

  updateSort(sortBy: 'price' | 'departureTime') {
    if (this.sortBy === sortBy) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortBy;
      this.sortOrder = 'asc';
    }
    this.applyFiltersAndSort();
  }

  updateFilters(filters: any, $event: any, type: string = '') {
    let filtersObj;
    if (type == 'first') {
      filtersObj = {priceRange: [$event.target.value, filters.priceRange[1]]}
    } else if (type == 'last') {
      filtersObj = {priceRange: [filters.priceRange[0], $event?.target?.value]};
    } else {
      filtersObj = {stops: $event};
    }

    this.filters = {...this.filters, ...filtersObj};
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  bookFlight(flight: Flight) {
    this.flightService.setSelectedFlight(flight);
    this.router.navigate(['/traveler-form']);
  }

  getAirlineLogo(airline: string): string {
    return `https://d263qmvlt29h99.cloudfront.net/${airline}.svg`;
  }
}
