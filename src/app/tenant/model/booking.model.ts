import {DisplayPicture} from "../../landlord/model/listing.model";
import {PriceVO} from "../../landlord/model/listing-value.model";

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
