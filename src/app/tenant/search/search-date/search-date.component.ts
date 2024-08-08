import {Component, effect, EventEmitter, input, Output} from '@angular/core';
import {BookedDatesDTOFromServer} from "../../model/booking.model";
import {CalendarModule} from "primeng/calendar";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-search-date',
  standalone: true,
  imports: [
    CalendarModule,
    FormsModule
  ],
  templateUrl: './search-date.component.html',
  styleUrl: './search-date.component.scss'
})
export class SearchDateComponent {

  dates = input.required<BookedDatesDTOFromServer>();
  searchDatesRaw = new Array<Date>();
  minDate = new Date();
  @Output()
  datesChanges = new EventEmitter<BookedDatesDTOFromServer>();
  @Output()
  stepValidityChange = new EventEmitter<boolean>();

  onDatesChange(newBookingDate: Date[]): void {
    this.searchDatesRaw = newBookingDate;
    const isDateValid = this.validateDateSearch();
    this.stepValidityChange.emit(isDateValid);
    if(isDateValid) {
      const searchDate: BookedDatesDTOFromServer ={
        startDate: this.searchDatesRaw[0],
        endDate: this.searchDatesRaw[1],
      }
      this.datesChanges.emit(searchDate);
    }
  }


  private validateDateSearch() {
    return this.searchDatesRaw.length === 2
    && this.searchDatesRaw[0] !== null
    && this.searchDatesRaw[1] !== null
    && this.searchDatesRaw[0].getTime() !== this.searchDatesRaw[1].getDate();
  }

  constructor() {
    this.restorePreviousDate();
  }

  private restorePreviousDate() {
    effect(() => {
      if(this.dates()){
        this.searchDatesRaw[0] = this.dates().startDate;
        this.searchDatesRaw[1] = this.dates().endDate;
      }
    });
  }
}
