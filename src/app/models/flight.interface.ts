export interface Flight {
  id: string;
  price: number;
  flights: FlightSegment[];
}

export interface FlightSegment {
  airline: string;
  departureTime: string;
  arrivalTime: string;
  departureAirport: string;
  arrivalAirport: string;
  date: string;
  stops: number;
  duration: string;
} 