import { Routes } from '@angular/router';
import {PropertiesComponent} from "./landlord/properties/properties.component";
import {authorityRouteAccess} from "./core/auth/authority-route-access";
import {HomeComponent} from "./home/home.component";

export const routes: Routes = [{
  path: 'landlord/properties',
  component: PropertiesComponent,
  canActivate: [authorityRouteAccess],
  data: {
    authorities: ["ROLE_LANDLORD"]
  }
 },
  {
    // takoder smo morali ovdje dodati novi path za tenant da bi svi uzeri mogli vidjeti home page
    path: '',
    component: HomeComponent,

}];
