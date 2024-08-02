import {Component, EventEmitter, input, Output} from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {NewListingPicture} from "../../../model/picture.model";

@Component({
  selector: 'app-picture-step',
  standalone: true,
  imports: [
    FontAwesomeModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './picture-step.component.html',
  styleUrl: './picture-step.component.scss'
})
export class PictureStepComponent {

  pictures = input.required<Array<NewListingPicture>>();
  @Output()
  pictureChange = new EventEmitter<Array<NewListingPicture>>();
  @Output()
  stepValidityChange = new EventEmitter<boolean>();

  onUploadNewPicture(target: EventTarget | null){
    const pictureFileList = this.extractFileFromTaregt(target);
    if (pictureFileList !== null){
      for (let i = 0; i < pictureFileList.length; i++){
        const picture = pictureFileList.item(i);
        if(picture !== null){
          const displayPicture: NewListingPicture = {
            file: picture,
            // base 64
            urlDisplay: URL.createObjectURL(picture)
          }
          // push to the singal
          this.pictures().push(displayPicture);
        }
      }
      // notifiy parent component
      this.pictureChange.emit(this.pictures());
      this.validatePictures();
    }
  }

  private extractFileFromTaregt(target: EventTarget | null) {
    const htmlInputTarget = target as HTMLInputElement;
    if (target === null || htmlInputTarget.files === null){
      return null;
    }
    return htmlInputTarget.files;
  }

  private validatePictures() {
    if (this.pictures().length >= 5) {
      this.stepValidityChange.emit(true);
    } else {
      this.stepValidityChange.emit(false);
    }
  }

  onTrashPicture(pictureToDelete: NewListingPicture) {
    const indexToDelete =
      this.pictures().findIndex(picture => picture.file.name === pictureToDelete.file.name);
      this.pictures().splice(indexToDelete, 1);
      this.validatePictures();
  }
}
