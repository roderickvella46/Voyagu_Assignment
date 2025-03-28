export interface Flight {
  id: string;
  price: number;
  flights: FlightSegment[];
}

export interface FlightSegment {
  airline: string;
  departure_time: string;
  arrival_time: string;
  departure_airport: string;
  arrival_airport: string;
  departure_date: string;
  arrival_date: string;
  stops: number;
  duration_minutes: string;
}
