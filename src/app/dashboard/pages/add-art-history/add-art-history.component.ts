import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { SidebarComponent } from '@dashboard/layout/sidebar/sidebar.component';
import { ArtPhotoGalleryComponent } from '@dashboard/modals/art-photo-gallery/art-photo-gallery.component';
import { AuctionArtDetailsModalComponent } from '@dashboard/modals/auction-art-details-modal/auction-art-details-modal.component';
import { AuctionArtService } from '@dashboard/services/auction-art.service';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputDirective,
    SpinnerComponent,
    PrimaryButtonDirective,
    InputErrorComponent,
    ArtPhotoGalleryComponent,
    SidebarComponent,
    AuctionArtDetailsModalComponent,
    MatMenuModule,
    InputDirective,
    MatIcon
  ],
  templateUrl: './add-art-history.component.html',
  styleUrl: './add-art-history.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddArtHistoryComponent {
  originalAuctionArtId = signal<string>('');

  artPhotoGalleryIsOpen = signal<boolean>(false);

  addArtHistoryForm: FormGroup;
  addArtHistorySubmitButtonIsDisabled = signal<boolean>(false);
  auctionArtDetailsModalIsOpen = signal<boolean>(false);
  aspectRatios = signal<number[]>([1.477, 1.054, 1, 0]);

  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #auctionArtService = inject(AuctionArtService);
  #appService = inject(AppService);
  #activatedRoute = inject(ActivatedRoute);
  #router = inject(Router);

  get blocksFormArray(): FormArray {
    return this.addArtHistoryForm.get('blocks') as FormArray;
  }

  get blocksFormArrayControls(): FormGroup[] {
    return this.blocksFormArray.controls as FormGroup[];
  }

  get extraInfoFormArray(): FormArray {
    return this.addArtHistoryForm.get('extraInfo') as FormArray;
  }

  get extraInfoFormArrayControls(): FormControl[] {
    return this.extraInfoFormArray.controls as FormControl[];
  }

  constructor() {
    this.originalAuctionArtId.set(this.#activatedRoute.snapshot.paramMap.get('id')!);

    this.addArtHistoryForm = this.#formBuilder.group({
      originalAuctionArtId: [this.originalAuctionArtId(), Validators.required],
      blocks: this.#formBuilder.array([], Validators.required),
      extract: ['', Validators.required],
      extraInfo: this.#formBuilder.array([
        this.#formBuilder.control('', Validators.required)
      ], Validators.required)
    });
  }

  addArtHistory(): void {
    this.addArtHistorySubmitButtonIsDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.addArtHistoryForm);

    if (!isValid) {
      this.addArtHistorySubmitButtonIsDisabled.set(false);
      return;
    }

    this.#auctionArtService.addArtHistory$(this.addArtHistoryForm).subscribe({
      next: () => {
        this.addArtHistoryForm.reset();

        this.#router.navigate(['/dashboard/publicar'], { queryParams: { type: 'Art' } });

        this.toastSuccess('Historia del arte agregada');
      },
      error: (error) => {
        console.error(error);

        this.toastError(error.error.error);
      }
    }).add(() => {
      this.addArtHistorySubmitButtonIsDisabled.set(false);
    });
  }

  removeExtraInfo(index: number): void {
    this.extraInfoFormArray.removeAt(index);
  }

  addExtraInfo(): void {
    this.extraInfoFormArray.push(this.#formBuilder.control('', Validators.required));
  }

  deleteBlock(index: number): void {
    this.blocksFormArray.removeAt(index);
  }

  setImage(image: string): void {
    this.addContent('image');

    const lastBlockIndex = this.blocksFormArrayControls.length - 1;

    this.blocksFormArrayControls[lastBlockIndex].get('content')?.setValue(image);
  }

  removeContent(index: number): void {
    this.blocksFormArray.removeAt(index);
  }

  addContent(type: string): void {
    const nuevoContenido = this.#formBuilder.group({
      type: [type, Validators.required],
      content: ['', Validators.required]
    });

    this.blocksFormArray.push(nuevoContenido);
  }

  openAuctionArtDetailsModal(): void {
    this.auctionArtDetailsModalIsOpen.set(true);
  }

  closeAuctionArtDetailsModal(): void {
    this.auctionArtDetailsModalIsOpen.set(false);
  }

  closeArtPhotoGallery(): void {
    this.artPhotoGalleryIsOpen.set(false);
  }

  openArtPhotoGallery(): void {
    this.artPhotoGalleryIsOpen.set(true);
  }

  controlHasError(control: FormControl): boolean {
    return this.#validatorsService.controlHasError(control);
  }

  getErrorFromControl(control: FormControl): string | undefined {
    return this.#validatorsService.getErrorFromControl(control);
  }

  hasError(field: string, form: FormGroup = this.addArtHistoryForm): boolean {
    return this.#validatorsService.hasError(form, field);
  }

  getError(field: string, form: FormGroup = this.addArtHistoryForm): string | undefined {
    return this.#validatorsService.getError(form, field);
  }

  formArrayHasError(formArray: FormArray, index: number): boolean {
    if (!this.addArtHistoryForm) return false;

    return this.#validatorsService.formArrayHasError(formArray, index);
  }

  getErrorFromFormArray(formArray: FormArray, index: number): string | undefined {
    if (!this.addArtHistoryForm) return undefined;

    return this.#validatorsService.getErrorFromFormArray(formArray, index);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }

  toastError(message: string): void {
    this.#appService.toastError(message);
  }
}
