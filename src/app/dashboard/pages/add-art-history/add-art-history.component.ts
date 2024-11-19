import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AppService } from '@app/app.service';
import { ArtPhotoGalleryComponent } from '@dashboard/modals/art-photo-gallery/art-photo-gallery.component';
import { AuctionArtDetailsModalComponent } from '@dashboard/modals/auction-art-details-modal/auction-art-details-modal.component';
import { AuctionArtService } from '@dashboard/services/auction-art.service';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SidebarComponent } from '@dashboard/layout/sidebar/sidebar.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

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
    MatIcon,
    CdkDropList,
    CdkDrag,
    JsonPipe
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
  #changeDetectorRef = inject(ChangeDetectorRef);
  #destroyRef: DestroyRef = inject(DestroyRef);

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
      blocks: this.#formBuilder.array([
        // this.#formBuilder.group({
        //   type: ['text', Validators.required],
        //   content: ['', Validators.required]
        // })
      ], Validators.required),
      extract: ['', Validators.required],
      extraInfo: this.#formBuilder.array([
        // this.#formBuilder.control('')
      ])
    });

    this.getArtHistory();
  }

  drop(event: CdkDragDrop<string[]>, formArray: FormArray): void {
    moveItemInArray(formArray.controls, event.previousIndex, event.currentIndex);
    formArray.updateValueAndValidity();
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

  getArtHistory(): void {
    this.#auctionArtService.getArtHistory$(this.originalAuctionArtId()).subscribe({
      next: (artHistory) => {
        const { blocks, extraInfo } = artHistory;

        blocks.forEach((block: any) => {
          this.addContent(block.type);
          this.blocksFormArrayControls[this.blocksFormArrayControls.length - 1].get('content')?.setValue(block.content);
        });

        extraInfo.forEach((info: string) => {
          this.extraInfoFormArray.push(this.#formBuilder.control(info, Validators.required));
        });

        this.#changeDetectorRef.markForCheck();
      },
      error: (error) => {
        this.addContent('text');

        this.extraInfoFormArray.push(this.#formBuilder.control(''));

        this.#changeDetectorRef.detectChanges();

        console.error(error);
      }
    });
  }

  removeExtraInfo(index: number): void {
    this.extraInfoFormArray.removeAt(index);
  }

  addExtraInfo(): void {
    this.extraInfoFormArray.push(this.#formBuilder.control(''));
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

    if (this.blocksFormArray.length === 1) {
      this.addArtHistoryForm.get('blocks')?.get([0])?.get('content')?.valueChanges.pipe(
        takeUntilDestroyed(this.#destroyRef)
      ).subscribe(value => {
        this.addArtHistoryForm.get('extract')?.setValue(value);
      });
    }
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
