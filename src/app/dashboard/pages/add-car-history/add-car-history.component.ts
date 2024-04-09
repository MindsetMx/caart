import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

import { AppService } from '@app/app.service';
import { AuctionCarService } from '@app/dashboard/services/auction-car.service';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { CarPhotoGalleryComponent } from '@dashboard/modals/car-photo-gallery/car-photo-gallery.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '@app/dashboard/layout/sidebar/sidebar.component';

@Component({
  standalone: true,
  imports: [
    CKEditorModule,
    ReactiveFormsModule,
    InputDirective,
    SpinnerComponent,
    PrimaryButtonDirective,
    InputErrorComponent,
    CarPhotoGalleryComponent,
    SidebarComponent
  ],
  templateUrl: './add-car-history.component.html',
  styleUrl: './add-car-history.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCarHistoryComponent {
  originalAuctionCarId = signal<string>('');

  carPhotoGalleryIsOpen = signal<boolean>(false);

  public Editor = Editor;

  addCarHistoryForm: FormGroup;
  addCarHistorySubmitButtonIsDisabled = signal<boolean>(false);

  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #auctionCarService = inject(AuctionCarService);
  #appService = inject(AppService);
  #activatedRoute = inject(ActivatedRoute);
  #router = inject(Router);

  constructor() {
    this.originalAuctionCarId.set(this.#activatedRoute.snapshot.paramMap.get('id')!);

    this.addCarHistoryForm = this.#formBuilder.group({
      originalAuctionCarId: [this.originalAuctionCarId(), Validators.required],
      content: ['', Validators.required],
      extract: ['', Validators.required],
      extraInfo: ['', Validators.required],
    });
  }

  addCarHistory(): void {
    this.addCarHistorySubmitButtonIsDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.addCarHistoryForm);

    if (!isValid) {
      this.addCarHistorySubmitButtonIsDisabled.set(false);
      return;
    }

    this.#auctionCarService.addCarHistory$(this.addCarHistoryForm).subscribe({
      next: (response) => {
        console.log({ response });

        this.addCarHistoryForm.reset();

        this.#router.navigate(['/dashboard/publicar-autos']);

        this.toastSuccess('Historia del auto agregada');
      },
      error: (error) => {
        console.error(error);

        this.toastError(error.error.error);
      }
    }).add(() => {
      this.addCarHistorySubmitButtonIsDisabled.set(false);
    });

    // this.#releaseCarForLiveAuctionService.releaseCarForLiveAuction$(this.addCarHistoryForm).subscribe({
  }

  closeCarPhotoGallery(): void {
    this.carPhotoGalleryIsOpen.set(false);
  }

  openCarPhotoGallery(): void {
    this.carPhotoGalleryIsOpen.set(true);
  }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.addCarHistoryForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.addCarHistoryForm) return undefined;

    return this.#validatorsService.getError(this.addCarHistoryForm, field);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }

  toastError(message: string): void {
    this.#appService.toastError(message);
  }
}
