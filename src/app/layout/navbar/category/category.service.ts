import { Injectable } from '@angular/core';
import { Category, CategoryName } from './category.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  // sada moramo instancirati sve te kategorije
  private categories: Category[] = [
    {
      icon: "eye",
      displayName: "All",
      technicalName: "All",
      activated: false
    },
    {
      icon: "eye",
      displayName: "Amazing views",
      technicalName: "AMAZING_VIEWS",
      activated: false
    },
    {
      icon: "exclamation",
      displayName: "OMG!",
      technicalName: "OMG",
      activated: false
    },
    {
      icon: "tree",
      displayName: "Treehouses",
      technicalName: "TREEHOUSES",
      activated: false
    },
    {
      icon: "umbrella-beach",
      displayName: "Beach",
      technicalName: "BEACH",
      activated: false
    },
    {
      icon: "tractor",
      displayName: "Farms",
      technicalName: "FARMS",
      activated: false
    },
    {
      icon: "snowflake",
      displayName: "Artic",
      technicalName: "ARTIC",
      activated: false
    },
    {
      icon: "house",
      displayName: "Tiny homes",
      technicalName: "TINY_HOMES",
      activated: false
    },
    {
      icon: "water",
      displayName: "Lake",
      technicalName: "LAKES",
      activated: false
    },
    {
      icon: "box",
      displayName: "Containers",
      technicalName: "CONTAINERS",
      activated: false
    },
    {
      icon: "tent",
      displayName: "Camping",
      technicalName: "CAMPING",
      activated: false
    },
    {
      icon: "person-skiing",
      displayName: "Skiing",
      technicalName: "SKIING",
      activated: false
    },
    {
      icon: "fire",
      displayName: "Campers",
      technicalName: "CAMPERS",
      activated: false
    },
    {
      icon: "sailboat",
      displayName: "Boat",
      technicalName: "BOAT",
      activated: false
    },
    {
      icon: "mug-saucer",
      displayName: "Bed & breakfasts",
      technicalName: "BED_AND_BREAKFEST",
      activated: false
    },
    {
      icon: "lightbulb",
      displayName: "Rooms",
      technicalName: "ROOMS",
      activated: false
    },
    {
      icon: "tower-observation",
      displayName: "Tower",
      technicalName: "TOWER",
      activated: false
    },
    {
      icon: "hill-rockslide",
      displayName: "Caves",
      technicalName: "CAVES",
      activated: false
    },
    {
      icon: "champagne-glasses",
      displayName: "Luxes",
      technicalName: "LUXES",
      activated: false
    },
    {
      icon: "kitchen-set",
      displayName: "Chef",
      technicalName: "CHEF",
      activated: false
    },
  ];

  private changeCategory$: BehaviorSubject<Category> = new BehaviorSubject<Category>(this.getCategoriesByDefault());
  changeCategoryObs = this.changeCategory$.asObservable();

  // korisiti cemo notifiy konponent koja se subscrib "changeCategoryObs" observable

  changeCategory(category : Category): void {
    this.changeCategory$.next(category);
  }

  getCategories(): Category[]{
    return this.categories;
  }

  getCategoriesByDefault(): Category{
    return this.categories[0];
  }

  getCategoryByTehnicalName(technicalName: CategoryName): Category | undefined{
      return this.categories.find((category) => category.technicalName === technicalName);
  }

  constructor() { }
}


