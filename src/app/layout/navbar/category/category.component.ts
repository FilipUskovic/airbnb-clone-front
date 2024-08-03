import { Component, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CategoryService } from './category.service';
import { Category, CategoryName } from './category.model';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter, map} from "rxjs";

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {

  categoryService = inject(CategoryService);

  // setiram vrijednosti za pripremu tj pohranu
  categories : Category[] | undefined;

  isHome = false;
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  currentActivatedCategory = this.categoryService.getCategoriesByDefault();

  ngOnInit(): void {
    // da znamo jesmo li na kome url ili ne
    this.listenRouter();
    this.currentActivatedCategory.activated = false;
    this.fetchCategories();
  }

  fetchCategories() {
    this.categories = this.categoryService.getCategories();
  }

  private listenRouter() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe({
      next: (event: NavigationEnd) => {
        this.isHome = event.url.split("?")[0] === "/";
        if (this.isHome && event.url.indexOf("?") === -1) {
          const categoryByTehnicalName = this.categoryService.getCategoryByTehnicalName("All");
          this.categoryService.changeCategory(categoryByTehnicalName!);
        }
      },
    });
    this.activatedRoute.queryParams.pipe(
      map(params => params['category'])
    ).subscribe({
      next: (categoryName: CategoryName) => {
        const category = this.categoryService.getCategoryByTehnicalName(categoryName);
        if(category){
          this.activateCategory(category);
          this.categoryService.changeCategory(category!);
        }
      }
    })
  }

  private activateCategory(category: Category) {
      this.currentActivatedCategory.activated = false;
      this.currentActivatedCategory = category;
      this.currentActivatedCategory.activated = true;
  }

  onChangeCategory(category: Category) {
    this.activateCategory(category);
    this.router.navigate([], {
      queryParams: {"category": category.technicalName},
      relativeTo: this.activatedRoute
    });
  }
}
