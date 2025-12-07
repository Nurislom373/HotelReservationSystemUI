import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IconComponent} from '../../components/icons/icons.component';
import {RoomTypeService} from '../../services/room-type.service';
import {RoomService} from '../../services/room.service';
import {ReservationsService} from '../../services/reservations.service';
import {CalendarModel} from '../../services/model/calendar.model';
import {RoomTypeModel} from '../../services/model/room.type.model';
import {RoomModel} from '../../services/model/room.model';
import {ReservationModel, ReservationStatus} from '../../services/model/reservation.model';
import {FilterModel} from '../../services/base/models/filter/filter.model';
import {FieldType} from '../../services/base/models/filter/field.type';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  calendarData: CalendarModel[] = [];
  reservations: ReservationModel[] = [];
  currentDate: Date = new Date();
  daysInMonth: Date[] = [];
  dayHeaders: { date: Date; dayName: string; dayNumber: string }[] = [];

  // Month and year selectors
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  availableYears: number[] = [];

  // Color mapping for room types
  roomTypeColors: Map<number, string> = new Map();

  constructor(
    private roomTypeService: RoomTypeService,
    private roomService: RoomService,
    private reservationsService: ReservationsService
  ) {
    // Initialize color palette for room types
    this.initializeColors();
  }

  ngOnInit() {
    // Initialize selected month and year
    this.selectedMonth = this.currentDate.getMonth();
    this.selectedYear = this.currentDate.getFullYear();
    
    // Generate available years (current year ± 5 years)
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      this.availableYears.push(i);
    }
    
    this.updateCalendarDays();
    this.loadCalendarData();
    this.loadReservations();
  }

  initializeColors() {
    // Color palette matching the design (orange, red, purple, light blue, etc.)
    const colors = [
      '#fb923c', // Orange (Apartment)
      '#ef4444', // Red (Family)
      '#a855f7', // Purple (Double)
      '#60a5fa', // Light Blue (Single)
      '#10b981', // Green
      '#f59e0b', // Amber
      '#ec4899', // Pink
      '#06b6d4', // Cyan
    ];

    // We'll assign colors based on room type ID
    // For now, we'll use a hash function
  }

  getRoomTypeColor(roomTypeId: number | undefined): string {
    if (!roomTypeId) return '#e5e7eb';

    if (!this.roomTypeColors.has(roomTypeId)) {
      const colors = [
        '#fb923c', '#ef4444', '#a855f7', '#60a5fa',
        '#10b981', '#f59e0b', '#ec4899', '#06b6d4'
      ];
      const index = roomTypeId % colors.length;
      this.roomTypeColors.set(roomTypeId, colors[index]);
    }

    return this.roomTypeColors.get(roomTypeId) || '#e5e7eb';
  }

  loadCalendarData() {
    // Load all room types
    this.roomTypeService.getAll('').subscribe({
      next: (roomTypesResponse) => {
        const roomTypes = roomTypesResponse.body || [];

        // Load all rooms
        this.roomService.getAll('').subscribe({
          next: (roomsResponse) => {
            const allRooms = roomsResponse.body || [];

            // Group rooms by room type to create CalendarModel structure
            this.calendarData = roomTypes.map(roomType => {
              const roomsForType = allRooms.filter(room => room.type?.id === roomType.id);
              return {
                id: roomType.id,
                roomType: roomType,
                rooms: roomsForType
              };
            }).filter(cal => cal.rooms.length > 0); // Only include room types that have rooms
          },
          error: (err) => {
            console.error('Error loading rooms:', err);
            // Use mock data if API fails
            this.loadMockCalendarData();
          }
        });
      },
      error: (err) => {
        console.error('Error loading room types:', err);
        // Use mock data if API fails
        this.loadMockCalendarData();
      }
    });
  }

  loadMockCalendarData() {
    // Mock data for development/testing
    const mockRoomTypes: RoomTypeModel[] = [
      { id: 1, name: 'Apartment', numberBeds: '2', maxOccupancy: '4', isSmokingRoom: false },
      { id: 2, name: 'Family', numberBeds: '3', maxOccupancy: '6', isSmokingRoom: false },
      { id: 3, name: 'Double', numberBeds: '1', maxOccupancy: '2', isSmokingRoom: false },
      { id: 4, name: 'Single', numberBeds: '1', maxOccupancy: '1', isSmokingRoom: false }
    ];

    const mockRooms: RoomModel[] = [
      { id: 1, number: 101, hotel: {} as any, type: mockRoomTypes[0] },
      { id: 2, number: 102, hotel: {} as any, type: mockRoomTypes[0] },
      { id: 3, number: 103, hotel: {} as any, type: mockRoomTypes[0] },
      { id: 4, number: 201, hotel: {} as any, type: mockRoomTypes[1] },
      { id: 5, number: 202, hotel: {} as any, type: mockRoomTypes[1] },
      { id: 6, number: 301, hotel: {} as any, type: mockRoomTypes[2] },
      { id: 7, number: 302, hotel: {} as any, type: mockRoomTypes[2] },
      { id: 8, number: 303, hotel: {} as any, type: mockRoomTypes[2] },
      { id: 9, number: 401, hotel: {} as any, type: mockRoomTypes[3] },
      { id: 10, number: 402, hotel: {} as any, type: mockRoomTypes[3] }
    ];

    this.calendarData = mockRoomTypes.map(roomType => ({
      id: roomType.id,
      roomType: roomType,
      rooms: mockRooms.filter(room => room.type.id === roomType.id)
    }));
  }

  loadReservations() {
    // Fetch all reservations and filter client-side for the current month
    this.reservationsService.getAll('').subscribe({
      next: (httpResponse) => {
        const allReservations = httpResponse.body || [];
        
        // Convert date strings to Date objects and filter for current month
        const reservations = allReservations.map(res => {
          const checkIn = res.checkInDate ? (typeof res.checkInDate === 'string' ? new Date(res.checkInDate) : new Date(res.checkInDate)) : new Date();
          const checkOut = res.checkOutDate ? (typeof res.checkOutDate === 'string' ? new Date(res.checkOutDate) : new Date(res.checkOutDate)) : new Date();
          
          return {
            ...res,
            checkInDate: checkIn,
            checkOutDate: checkOut
          };
        });

        // Filter reservations that overlap with the current month
        if (this.daysInMonth.length > 0) {
          const firstDay = new Date(this.daysInMonth[0]);
          const lastDay = new Date(this.daysInMonth[this.daysInMonth.length - 1]);
          const monthEnd = new Date(lastDay);
          monthEnd.setDate(monthEnd.getDate() + 1); // Day after last day

          firstDay.setHours(0, 0, 0, 0);
          monthEnd.setHours(0, 0, 0, 0);

          this.reservations = reservations.filter(res => {
            const checkIn = new Date(res.checkInDate);
            const checkOut = new Date(res.checkOutDate);
            checkIn.setHours(0, 0, 0, 0);
            checkOut.setHours(0, 0, 0, 0);
            
            // Reservation overlaps with month if it starts before month ends and ends after month starts
            return checkIn < monthEnd && checkOut > firstDay;
          });
        } else {
          this.reservations = reservations;
        }
      },
      error: (err) => {
        console.error('Error loading reservations:', err);
        // Fallback to empty array
        this.reservations = [];
      }
    });
  }

  updateCalendarDays() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Get first and last day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Generate array of days in the month
    this.daysInMonth = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      this.daysInMonth.push(new Date(year, month, i));
    }

    // Generate day headers with day names
    this.dayHeaders = this.daysInMonth.map(date => {
      const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      return {
        date: date,
        dayName: dayNames[date.getDay()],
        dayNumber: `${date.getDate()} ${monthNames[date.getMonth()]}`
      };
    });
  }

  onMonthYearChange() {
    // Update currentDate based on selected month and year
    this.currentDate = new Date(this.selectedYear, this.selectedMonth, 1);
    this.updateCalendarDays();
    this.loadReservations();
  }

  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.selectedMonth = this.currentDate.getMonth();
    this.selectedYear = this.currentDate.getFullYear();
    this.updateCalendarDays();
    this.loadReservations();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.selectedMonth = this.currentDate.getMonth();
    this.selectedYear = this.currentDate.getFullYear();
    this.updateCalendarDays();
    this.loadReservations();
  }

  getMonthYearString(): string {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  getReservationsForRoom(roomId: number | undefined): ReservationModel[] {
    if (!roomId) return [];
    return this.reservations.filter(reservation => {
      return reservation.room?.id === roomId;
    });
  }

  getReservationStartColumn(reservation: ReservationModel): number {
    if (this.daysInMonth.length === 0) return 1;

    const checkIn = new Date(reservation.checkInDate);
    const firstDay = new Date(this.daysInMonth[0]);
    const lastDay = new Date(this.daysInMonth[this.daysInMonth.length - 1]);

    checkIn.setHours(0, 0, 0, 0);
    firstDay.setHours(0, 0, 0, 0);
    lastDay.setHours(0, 0, 0, 0);

    // If reservation starts before the month, start at column 1
    if (checkIn < firstDay) return 1;

    // If reservation starts after the month, don't show it
    if (checkIn > lastDay) return -1;

    const dayIndex = this.daysInMonth.findIndex(day => {
      const d = new Date(day);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === checkIn.getTime();
    });

    // Return 1-based column index (grid-column-start is 1-based)
    return dayIndex >= 0 ? dayIndex + 1 : 1;
  }

  getReservationSpan(reservation: ReservationModel): number {
    if (this.daysInMonth.length === 0) return 1;

    const checkIn = new Date(reservation.checkInDate);
    const checkOut = new Date(reservation.checkOutDate);
    const firstDay = new Date(this.daysInMonth[0]);
    const lastDay = new Date(this.daysInMonth[this.daysInMonth.length - 1]);
    const monthEnd = new Date(lastDay);
    monthEnd.setDate(monthEnd.getDate() + 1); // Day after last day

    checkIn.setHours(0, 0, 0, 0);
    checkOut.setHours(0, 0, 0, 0);
    firstDay.setHours(0, 0, 0, 0);
    monthEnd.setHours(0, 0, 0, 0);

    // Calculate visible start and end dates within the month
    const visibleStart = checkIn < firstDay ? firstDay : checkIn;
    const visibleEnd = checkOut > monthEnd ? monthEnd : checkOut;

    // Calculate the span in days
    const diffTime = visibleEnd.getTime() - visibleStart.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(1, diffDays);
  }

  isReservationStart(reservation: ReservationModel, date: Date): boolean {
    const checkIn = new Date(reservation.checkInDate);
    const currentDate = new Date(date);

    checkIn.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    return checkIn.getTime() === currentDate.getTime();
  }

  isReservationVisibleInMonth(reservation: ReservationModel): boolean {
    if (this.daysInMonth.length === 0) return false;
    if (!reservation.room || !reservation.room.id) return false;

    const checkIn = new Date(reservation.checkInDate);
    const checkOut = new Date(reservation.checkOutDate);
    const firstDay = new Date(this.daysInMonth[0]);
    const lastDay = new Date(this.daysInMonth[this.daysInMonth.length - 1]);
    const monthEnd = new Date(lastDay);
    monthEnd.setDate(monthEnd.getDate() + 1); // Day after last day

    checkIn.setHours(0, 0, 0, 0);
    checkOut.setHours(0, 0, 0, 0);
    firstDay.setHours(0, 0, 0, 0);
    monthEnd.setHours(0, 0, 0, 0);

    // Reservation is visible if it overlaps with the current month
    return checkIn < monthEnd && checkOut > firstDay;
  }
}
