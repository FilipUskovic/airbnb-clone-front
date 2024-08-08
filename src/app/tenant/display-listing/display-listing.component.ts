import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {TenantListingService} from "../tenant-listing.service";
import {ActivatedRoute} from "@angular/router";
import {ToastService} from "../../layout/toast.service";
import {CategoryService} from "../../layout/navbar/category/category.service";
import {CountryService} from "../../landlord/properties-create/step/country.service";
import {DisplayPicture, Listing} from "../../landlord/model/listing.model";
import {Category} from "../../layout/navbar/category/category.model";
import {map} from "rxjs";
import {NgClass} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {AvatarComponent} from "../../layout/navbar/avatar/avatar.component";
import {BookDateComponent} from "../book-date/book-date.component";

@Component({
  selector: 'app-display-listing',
  standalone: true,
  imports: [
    NgClass,
    FaIconComponent,
    AvatarComponent,
    BookDateComponent
  ],
  templateUrl: './display-listing.component.html',
  styleUrl: './display-listing.component.scss'
})
export class DisplayListingComponent implements OnInit, OnDestroy {

  tenantListingService = inject(TenantListingService);
  activatedRoute = inject(ActivatedRoute);
  toastService = inject(ToastService);
  categoryService = inject(CategoryService);
  countryService = inject(CountryService);

  listings: Listing | undefined;
  category: Category | undefined;
  currentPublicId = "";
  loading: boolean = true;


  constructor() {
    this.listenToFetchListing();
  }

  ngOnInit(): void {
    // ekstraktat cemo parametre iz routere-a jer cemo staviti publicId unutar url-a i ako user bude refresagao
    // opet ce doci na house gdje je kliknuo
    this.extractIdParamFromRouter();

  }

  ngOnDestroy(): void {
    this.tenantListingService.resetGetOneByPublicId();

  }

  private extractIdParamFromRouter() {
    this.activatedRoute.queryParams.pipe(
      map(params => params['id'])
    ).subscribe({
      next: publicId => this.fetchListing(publicId)
    })
  }

  // posto smo napravili to moramo listen to signal kada dode natrag pa cemo napraviti funckiju koja slusa
  // i dodati u knostrukotr
  private fetchListing(publicId: any) {
    this.loading = true;
    this.currentPublicId = publicId;
    this.tenantListingService.getOneByPublicId(publicId);
  }

  private listenToFetchListing() {
    effect(() => {
      const oneByPublicIdState = this.tenantListingService.getOneByPublicIdSignal();
      if(oneByPublicIdState.status === "OK"){
        this.loading = false;
        // i dodjeliti listing variable to vrijdsnoti
        this.listings = oneByPublicIdState.value;
        if(this.listings){
          // malo cemo promjeniti sliku jer zelimo da cover bude prva
          this.listings.pictures = this.putCoverPictureFirst(this.listings.pictures);
          this.category = this.categoryService.getCategoryByTehnicalName(this.listings.category);
          this.countryService.getCountryByCode(this.listings.location)
            .subscribe({
              next: country => {
                if(this.listings){
                  this.listings.location = country.region + ", " + country.name.common;
                }
              }
            });
        }
      }else if (oneByPublicIdState.status === "ERROR"){
        this.loading = false;
        this.toastService.send({
           severity: "error", summary: "Error", detail: "Error fetching one by public id",
        })
      }
    });
  }

  private putCoverPictureFirst(pictures: Array<DisplayPicture>) {
      const coverIndex = pictures.findIndex(picture => picture.isCover);
      if(coverIndex){
        const cover = pictures[coverIndex];
        pictures.splice(coverIndex, 1);
        pictures.unshift(cover);
      }
      return pictures;
  }

}
