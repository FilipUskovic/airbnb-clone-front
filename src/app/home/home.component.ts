import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {TenantListingService} from "../tenant/tenant-listing.service";
import {ToastService} from "../layout/toast.service";
import {CategoryService} from "../layout/navbar/category/category.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CardListing} from "../landlord/model/listing.model";
import {Pagination} from "../core/model/request.model";
import {Subscription} from "rxjs";
import {Category} from "../layout/navbar/category/category.model";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {CardListingComponent} from "../shared/card-listing/card-listing.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FaIconComponent,
    CardListingComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  tenantListingService = inject(TenantListingService)
  toastService = inject(ToastService);
  categoryService = inject(CategoryService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  listings: Array<CardListing> | undefined;
  pageRequest: Pagination = {size: 20, page: 0, sort: []};
  loading: boolean = false;
  categoryServiceSubscription: Subscription | undefined;


  constructor() {
    this.listenToGetAllCategory();
  }

  ngOnDestroy(): void {
    this.tenantListingService.resetGetAllCategory();
    // pomocu ovoga necemo imati nikakv memory leak, jer kada component bude destroyed mi cemo se unsubsribe-at
    if(this.categoryServiceSubscription){
      this.categoryServiceSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.listenToChangeCategory();
  }

  private listenToChangeCategory() {
    this.categoryServiceSubscription = this.categoryService.changeCategoryObs.subscribe({
      next: (category: Category) => {
        this.loading = true;
        this.tenantListingService.getAllByCategory(this.pageRequest, category.technicalName);
      }
    })
  }

  private listenToGetAllCategory() {
    effect(() => {
      const categoryListingStateSignal = this.tenantListingService.getAllByCategorySignal();
      if (categoryListingStateSignal.status === "OK") {
        this.listings = categoryListingStateSignal.value?.content;
        this.loading = false;
      }else if (categoryListingStateSignal.status === "ERROR") {
        this.toastService.send({
          severity: "error", summary: "Error", detail: "Error while fetchin the listing categories",
        });
        this.loading = false;
      }
    });
  }
}
