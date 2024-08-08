import {DisplayPicture} from "../../landlord/model/listing.model";
import {PriceVO} from "../../landlord/model/listing-value.model";
import {Dayjs} from "dayjs";

export interface BookedDatesDtoFromServer {
 startDate: Date;
 endDate: Date;
}

export interface BookedListing {
  location: string,
  cover: DisplayPicture,
  totalPrice: PriceVO,
  dates: BookedDatesDtoFromServer,
  bookingPublicId: string,
  listingPublicId: string,
  loading: boolean
}

export interface CreateBooking {
  startDate: Date,
  endDate: Date,
  listingPublicId: string
}

export interface BookedDatesDTOFromClient {
 startDate: Dayjs,
 endDate: Dayjs
}

export interface BookedDatesDTOFromServer {
  startDate: Date,
  endDate: Date
}

export interface BookedListing {
  location: string,
  cover: DisplayPicture,
  totalPrice: PriceVO,
  dates: BookedDatesDTOFromServer,
  bookingPublicId: string,
  listingPublicId: string,
  loading: boolean
}
