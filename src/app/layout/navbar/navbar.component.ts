import {Component, effect, inject, OnInit} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import {ToolbarModule} from 'primeng/toolbar'
import {MenuModule} from 'primeng/menu'
import { CategoryComponent } from './category/category.component';
import { AvatarComponent } from './avatar/avatar.component';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog'
import { MenuItem } from 'primeng/api';
import {ToastService} from "../toast.service";
import {AuthService} from "../../core/auth/auth.service";
import {User} from "../../core/model/user.model";
import {PropertiesCreateComponent} from "../../landlord/properties-create/properties-create.component";
import {SearchComponent} from "../../tenant/search/search.component";
import {ActivatedRoute} from "@angular/router";
import dayjs from "dayjs";


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ButtonModule,
     FontAwesomeModule,
      ToolbarModule,
      MenuModule,
      CategoryComponent,
    AvatarComponent],
    providers: [DialogService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  location: string = "Anywhere";
  guests: string = "Add guests";
  dates: string = "Any week";

  toastServise = inject(ToastService);
  authService = inject(AuthService);
  activatedRoute = inject(ActivatedRoute);

  login = () => this.authService.login()
  logout = () => this.authService.logout();
  dialogService = inject(DialogService);
  ref: DynamicDialogRef | undefined;

  currentMenuItems: MenuItem[] | undefined = [];
   connectedUser: User = {email: this.authService.notConnected};

  constructor() {
    effect(() => {
      if (this.authService.fetchUser().status === "OK") {
        this.connectedUser = this.authService.fetchUser().value!;
        this.currentMenuItems = this.fetchMenu();
      }
    });
  }

  ngOnInit(): void {
    this.authService.fetch(false);
  // this.fetchMenu();
  // this.toastServise.send({severity: "info", summary: "Welcome fico"})
    this.extractInformationForSearch();
  }


  private fetchMenu(): MenuItem[] {
    if (this.authService.isAuthenticated()) {
      return [
        {
          label: "My properties",
          routerLink: "landlord/properties",
          visible: this.hasToBeLandlord(),
        },
        {
          label: "My booking",
          routerLink: "booking",
        },
        {
          label: "My reservation",
          routerLink: "landlord/reservation",
          visible: this.hasToBeLandlord(),
        },
        {
          label: "Log out",
          command: this.logout
        },
      ]
    } else {
      return [
        {
          label: "Sign up",
          styleClass: "font-bold",
          command: this.login
        },
        {
          label: "Log in",
          command: this.login
        }
      ]
    }
  }

  hasToBeLandlord(): boolean {
    console.log(this.authService.fetchUser().value!.authorities!);
    return this.authService.hasAnyAuthority("ROLE_LANDLORD");
  }

  openNewListing(): void {
    this.ref = this.dialogService.open(PropertiesCreateComponent,
      {
        width: "60%",
        header: "Airbnb your home",
        closable: true,
        focusOnShow: true,
        modal: true,
        showHeader: true
      })
  }

  // dodao sam novi open dialog za search, i moramo ga bindati kada user klikne to je u navbar html
  openNewSearch(): void {
    this.ref = this.dialogService.open(SearchComponent, {
      width: "40%",
      header: "Search",
      closable: true,
      focusOnShow: true,
      modal: true,
      showHeader: true
    });
  }

  private extractInformationForSearch(): void {
    this.activatedRoute.queryParams.subscribe({
      next: params => {
        if (params["location"]) {
          this.location = params["location"];
          this.guests = params["guests"] + " Guests";
          this.dates = dayjs(params["startDate"]).format("MMM-DD")
            + " to " + dayjs(params["endDate"]).format("MMM-DD");
        } else if (this.location !== "Anywhere") {
          this.location = "Anywhere";
          this.guests = "Add guests";
          this.dates = "Any week";
        }
      }
    })
  }

}

