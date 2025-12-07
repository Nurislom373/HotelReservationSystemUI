import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Reservation {
  id: string;
  guestName: string;
  guestEmail: string;
  roomType: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  total: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private reservations: Reservation[] = [
    {
      id: '1',
      guestName: 'Sarah Johnson',
      guestEmail: 'sarah.j@email.com',
      roomType: 'Deluxe Suite',
      roomNumber: '204',
      checkIn: '2025-11-22',
      checkOut: '2025-11-25',
      total: 660,
      status: 'confirmed'
    },
    {
      id: '2',
      guestName: 'Michael Chen',
      guestEmail: 'm.chen@email.com',
      roomType: 'Ocean View',
      roomNumber: '305',
      checkIn: '2025-11-23',
      checkOut: '2025-11-27',
      total: 880,
      status: 'confirmed'
    },
    {
      id: '3',
      guestName: 'Emma Davis',
      guestEmail: 'emma.d@email.com',
      roomType: 'Garden Villa',
      roomNumber: '102',
      checkIn: '2025-11-24',
      checkOut: '2025-11-28',
      total: 1400,
      status: 'pending'
    },
    {
      id: '4',
      guestName: 'James Wilson',
      guestEmail: 'j.wilson@email.com',
      roomType: 'Penthouse',
      roomNumber: '501',
      checkIn: '2025-11-25',
      checkOut: '2025-11-30',
      total: 2500,
      status: 'confirmed'
    },
    {
      id: '5',
      guestName: 'Olivia Brown',
      guestEmail: 'olivia.b@email.com',
      roomType: 'Standard',
      roomNumber: '105',
      checkIn: '2025-11-20',
      checkOut: '2025-11-22',
      total: 300,
      status: 'cancelled'
    }
  ];

  getReservations(): Observable<Reservation[]> {
    return of(this.reservations);
  }

  getReservationById(id: string): Observable<Reservation | undefined> {
    const reservation = this.reservations.find(r => r.id === id);
    return of(reservation);
  }
}



