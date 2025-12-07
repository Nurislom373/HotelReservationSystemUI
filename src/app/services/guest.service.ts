import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  visits: number;
  status: 'checked-in' | 'checked-out' | 'upcoming';
  currentRoom?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  private guests: Guest[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 234 567 8900',
      visits: 5,
      status: 'checked-in',
      currentRoom: '204'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'm.chen@email.com',
      phone: '+1 234 567 8901',
      visits: 3,
      status: 'checked-in',
      currentRoom: '305'
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma.d@email.com',
      phone: '+1 234 567 8902',
      visits: 2,
      status: 'upcoming',
      currentRoom: '102'
    },
    {
      id: '4',
      name: 'James Wilson',
      email: 'j.wilson@email.com',
      phone: '+1 234 567 8903',
      visits: 1,
      status: 'upcoming',
      currentRoom: '501'
    },
    {
      id: '5',
      name: 'Olivia Brown',
      email: 'olivia.b@email.com',
      phone: '+1 234 567 8904',
      visits: 7,
      status: 'checked-out'
    },
    {
      id: '6',
      name: 'David Martinez',
      email: 'd.martinez@email.com',
      phone: '+1 234 567 8905',
      visits: 4,
      status: 'checked-in',
      currentRoom: '208'
    }
  ];

  getGuests(): Observable<Guest[]> {
    return of(this.guests);
  }

  getGuestById(id: string): Observable<Guest | undefined> {
    const guest = this.guests.find(g => g.id === id);
    return of(guest);
  }
}

