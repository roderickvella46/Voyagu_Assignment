import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightService } from '../../services/flight.service';
import { Flight } from '../../models/flight';

@Component({
  selector: 'app-traveler-form',
  templateUrl: './traveler-form.component.html',
  styleUrls: ['./traveler-form.component.scss']
})
export class TravelerFormComponent implements OnInit {
  travelerForm: FormGroup;
  selectedFlight: Flight | null = null;
  months = Array.from({length: 12}, (_, i) => {
    const month = new Date(0, i).toLocaleString('default', { month: 'long' });
    return { value: (i + 1).toString().padStart(2, '0'), label: month };
  });
  days = Array.from({length: 31}, (_, i) => (i + 1).toString().padStart(2, '0'));
  years = Array.from({length: 100}, (_, i) => (new Date().getFullYear() - i).toString());

  constructor(
    private fb: FormBuilder,
    private flightService: FlightService,
    private router: Router
  ) {
    this.travelerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['male', Validators.required],
      birthMonth: ['', Validators.required],
      birthDay: ['', Validators.required],
      birthYear: ['', Validators.required],
      citizenship: ['United States', Validators.required]
    });
  }

  ngOnInit() {
    // Get selected flight
    this.flightService.getSelectedFlight().subscribe(flight => {
      this.selectedFlight = flight;
      if (!flight) {
        this.router.navigate(['/flights']);
        return;
      }
    });

    // Restore form data if exists
    this.flightService.getTravelerFormData().subscribe(data => {
      if (data) {
        this.travelerForm.patchValue(data);
      }
    });

    // Save form data on changes
    this.travelerForm.valueChanges.subscribe(data => {
      this.flightService.setTravelerFormData(data);
    });
  }

  onSubmit() {
    if (this.travelerForm.valid && this.selectedFlight) {
      console.log('Form Data:', {
        travelerInfo: this.travelerForm.value,
        flightId: this.selectedFlight.id
      });
      // In a real application, you would send this data to an API
      alert(JSON.stringify({
        travelerInfo: this.travelerForm.value,
        flightId: this.selectedFlight.id
      }, null, 2));
    }
  }

  onBack() {
    this.router.navigate(['/flights']);
  }
} 