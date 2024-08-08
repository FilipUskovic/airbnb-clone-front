import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {BookingService} from "../service/booking.service";
import {ToastService} from "../../layout/toast.service";
import {BookedListing} from "../model/booking.model";
import {CardListingComponent} from "../../shared/card-listing/card-listing.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-booked-listing',
  standalone: true,
  imports: [
    CardListingComponent,
    FaIconComponent
  ],
  templateUrl: './booked-listing.component.html',
  styleUrl: './booked-listing.component.scss'
})
export class BookedListingComponent implements OnInit, OnDestroy {

  bookingService = inject(BookingService);
  toastService = inject(ToastService);
  bookedListing = new Array<BookedListing>();

  loading = false;


  constructor() {
    this.listenFetchBooking();
    this.listenToCancel();
  }

  ngOnDestroy(): void {
    this.bookingService.resetCancel();
  }

  ngOnInit(): void {
    this.fetchBooking();
  }

  private fetchBooking() {
    this.loading = true;
    this.bookingService.getBookedListing();
  }

  onCancelBooking(bookedListing: BookedListing) {
    bookedListing.loading = true;
    this.bookingService.cancel(bookedListing.bookingPublicId, bookedListing.listingPublicId, false);
  }

  private listenFetchBooking() {
    effect(() => {
      const bookListingState = this.bookingService.getBookingListingSignal();
      if (bookListingState.status === "OK") {
        this.loading = false;
        this.bookedListing = bookListingState.value!;
      }else if (bookListingState.status === "ERROR") {
        this.loading = false;
        this.toastService.send({
          severity: "error", summary: "Error",detail: "Error while fetching listing bookings",
        })
      }
    });
  }

  private listenToCancel() {
    effect(() => {
      const cancelState = this.bookingService.cancelSignal();
      if (cancelState.status === "OK") {
       const listingToDeleteIndex = this.bookedListing.findIndex(
         listing => listing.bookingPublicId === cancelState.value
       );
        this.bookedListing.splice(listingToDeleteIndex, 1);
        this.toastService.send({
          severity: "success", summary: "Success", detail: "Cancelled",
        })
      }else if(cancelState.status === "ERROR") {
        const listingToDeleteIndex = this.bookedListing.findIndex(
          listing => listing.bookingPublicId === cancelState.value
        );
          this.bookedListing[listingToDeleteIndex].loading = false;
          this.toastService.send({
            severity: "error", summary: "Error",detail: "Error while cancel ur booking",
          })
      }
    });
  }
}
