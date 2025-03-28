import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Flight } from '../models/flight';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private apiUrl = 'https://public-front-bucket.s3.eu-central-1.amazonaws.com/test/test_flights.json';
  private selectedFlightSubject = new BehaviorSubject<Flight | null>(null);
  private travelerFormDataSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  getFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.apiUrl);
  }

  setSelectedFlight(flight: Flight) {
    this.selectedFlightSubject.next(flight);
  }

  getSelectedFlight(): Observable<Flight | null> {
    return this.selectedFlightSubject.asObservable();
  }

  setTravelerFormData(data: any) {
    this.travelerFormDataSubject.next(data);
  }

  getTravelerFormData(): Observable<any> {
    return this.travelerFormDataSubject.asObservable();
  }
} 