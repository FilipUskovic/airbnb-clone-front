import {Component, inject, OnInit} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import {ToolbarModule} from 'primeng/toolbar'
import {MenuModule} from 'primeng/menu'
import { CategoryComponent } from './category/category.component';
import { AvatarComponent } from './avatar/avatar.component';
import {DialogService} from 'primeng/dynamicdialog'
import { MenuItem } from 'primeng/api';
import {ToastService} from "../toast.service";


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
  guest: string = "Add guests";
  dates: string = "Any week";

  toastServise = inject(ToastService);

  // login () => this.authService.login()
  // loginout () => this.authService.logOut()

  currentMenuItems: MenuItem[] | undefined = [];

  ngOnInit(): void {
   this.fetchMenu();
   this.toastServise.send({severity: "info", summary: "Welcome fico"})
  }
  fetchMenu() {
    return [
      {
        label: "Sign Up",
        styleClass: "font-bold"
      },
      {
        label: "Log in",
      }
  ];
  }

}
