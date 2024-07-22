import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [NgClass, FontAwesomeModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
onClick() {
throw new Error('Method not implemented.');
}

  imageUrl = input<string>();
  avatarSize = input<"avatar-sm" | "avatar-xl">();
}
