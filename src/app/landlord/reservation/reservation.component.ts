import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {BookingService} from "../../tenant/service/booking.service";
import {ToastService} from "../../layout/toast.service";
import {BookedListing} from "../../tenant/model/booking.model";
import {CardListingComponent} from "../../shared/card-listing/card-listing.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    CardListingComponent,
    FaIconComponent
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss'
})
export class ReservationComponent implements OnInit, OnDestroy{
   bookingService = inject(BookingService);
   toastService = inject(ToastService);

   reservationListing = new Array<BookedListing>();
   loading = false;


  constructor() {
    this.listenToFetchReservation();
    this.listenToCancelReservation();
  }

  ngOnDestroy(): void {
    this.bookingService.resetCancel();
  }

  ngOnInit(): void {
    this.fetchReservation();
  }


  private fetchReservation() {
    this.loading = true;
    this.bookingService.getBookedListingForLandlord();
  }

  private listenToCancelReservation() {
    effect(() => {
      const cancelReservationState = this.bookingService.cancelSignal();
      if (cancelReservationState.status === "OK") {
        const indexToDelete = this.reservationListing.findIndex(
          listing => listing.bookingPublicId === cancelReservationState.value);
        this.reservationListing.splice(indexToDelete, 1);
        this.toastService.send({
          severity: "success", summary: "Success", detail: "Successfully cancelled reservation",
        });
      }else if(cancelReservationState.status === "ERROR") {
        const indexToDelete = this.reservationListing.findIndex(
          listing => listing.bookingPublicId === cancelReservationState.value);
        this.reservationListing[indexToDelete].loading = false;
        this.toastService.send({
          severity: "error", summary: "Error",detail: "Error while canceling reservation",
        })
      }
    });
  }

  private listenToFetchReservation() {
    effect(() => {
      const reservationBookingState = this.bookingService.getBookingListingForLandlordSignal();
      if (reservationBookingState.status === "OK") {
        this.loading = false;
        this.reservationListing = reservationBookingState.value!;
      }else if (reservationBookingState.status === "ERROR") {
        this.loading = false;
        this.toastService.send({
          severity: "error", summary: "Error",detail: "Error while fetching reservation",
        })
      }
    });
  }

  onCancelReservation(reservation: BookedListing): void {
    reservation.loading = true;
    this.bookingService.cancel(reservation.bookingPublicId, reservation.listingPublicId, true)
  }


}
