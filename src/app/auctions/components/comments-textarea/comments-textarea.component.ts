import { ChangeDetectionStrategy, Component, EventEmitter, Output, effect, inject, input, signal } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CommentsService } from '@auctions/services/comments.service';
import { AuthStatus } from '@auth/enums';
import { UserData } from '@auth/interfaces';
import { AuthService } from '@auth/services/auth.service';
import { AutoResizeTextareaDirective, PrimaryButtonDirective } from '@shared/directives';
import { ValidatorsService } from '@shared/services/validators.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { AppComponent } from '@app/app.component';
import { AuctionTypes } from '@auctions/enums/auction-types';
import { AuctionTypesComments } from '@auctions/enums';
import { CloudinaryCroppedImageService } from '@app/dashboard/services/cloudinary-cropped-image.service';
import { MatIcon } from '@angular/material/icon';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';

@Component({
  selector: 'comments-textarea',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AutoResizeTextareaDirective,
    PrimaryButtonDirective,
    SpinnerComponent,
    MatIcon,
    InputErrorComponent,
    SpinnerComponent,
  ],
  templateUrl: './comments-textarea.component.html',
  styleUrls: ['./comments-textarea.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsTextareaComponent {
  auctioneerUserId = input<string>();
  auctionCarPublishId = input.required<string>();
  parentCommentId = input<string>();
  rows = input<number>(4);
  isSeller = input<boolean>();
  placeholder = input.required<string>();
  auctionType = input.required<AuctionTypes>();
  auctionTypeComment = input.required<AuctionTypesComments>();
  isLoading = signal<boolean[]>([]);

  @Output() commentCreated = new EventEmitter<void>();

  createCommentButtonIsDisabled = signal<boolean>(false);
  images = signal<string[]>([]);

  #formBuilder = inject(FormBuilder);
  #authService = inject(AuthService);
  #commentsService = inject(CommentsService);
  #validatorsService = inject(ValidatorsService);
  #appComponent = inject(AppComponent);
  #cloudinaryCroppedImageService = inject(CloudinaryCroppedImageService);

  createComment: FormGroup;

  auctionCarPublishIdEffect = effect(() => {
    this.createComment?.get('itemId')?.setValue(this.auctionCarPublishId());
  });

  get authStatus(): AuthStatus {
    return this.#authService.authStatus();
  }

  constructor() {
    this.createComment = this.#formBuilder.group({
      text: ['', Validators.required],
      isBid: [false, Validators.required],
      isSeller: [this.isSeller() || this.user?.id === this.auctioneerUserId(), Validators.required],
      itemId: ['', Validators.required],
      images: [[], Validators.maxLength(5)],
      parentCommentId: [this.parentCommentId() || null],
    });

    this.setupConditionalValidation();

    // this.createComment?.get('images')?.valueChanges.pipe(
    //   takeUntilDestroyed()
    // ).subscribe((images) => {
    //   this.images.set(images);
    // });
  }

  get user(): UserData | null {
    return this.#authService.currentUser();
  }

  setupConditionalValidation(): void {
    this.createComment.get('images')?.valueChanges.pipe(
      takeUntilDestroyed()
    ).subscribe(images => {
      this.images.set(images);

      const textControl = this.createComment.get('text')!;

      if (images && images.length > 0) {
        textControl.clearValidators();
      } else {
        textControl.setValidators([Validators.required]);
      }
      textControl.updateValueAndValidity();
    });
  }

  createCommentSubmit(): void {
    if (this.authStatus === AuthStatus.notAuthenticated) {
      this.openSignInModal();

      return;
    }

    this.createCommentButtonIsDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.createComment as FormGroup);

    if (!isValid) {
      this.createCommentButtonIsDisabled.set(false);
      return;
    }

    this.#commentsService.createComment(this.createComment as FormGroup, this.auctionType(), this.auctionTypeComment()).subscribe({
      next: () => {
        this.createComment?.reset();
        this.createComment?.get('isBid')?.setValue(false);
        this.createComment?.get('isSeller')?.setValue(this.isSeller() || this.user?.id === this.auctioneerUserId());
        this.createComment?.get('itemId')?.setValue(this.auctionCarPublishId());
        this.createComment?.get('images')?.setValue([]);
        this.createComment?.get('parentCommentId')?.setValue(this.parentCommentId() || null);
        this.images.set([]);
        this.commentCreated.emit();
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.createCommentButtonIsDisabled.set(false);
    });
  }

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.item(0);

    if (!file) return;

    const index = this.isLoading().length;

    this.isLoading.update((isLoading) => {
      isLoading[index] = true;

      return isLoading;
    });

    this.#cloudinaryCroppedImageService.uploadImageDirect$().pipe(
      switchMap((response) =>
        this.#cloudinaryCroppedImageService.uploadImage$(file, response.result.uploadURL)
      )
    ).subscribe({
      next: (response) => {
        this.createComment?.get('images')?.setValue([...this.createComment?.get('images')?.value, response.result.variants[0]]);
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.isLoading.set(this.isLoading().map((value, i) => i === index ? false : value));
    });
  }

  removeImage(index: number): void {
    const images = this.createComment?.get('images')?.value as string[];
    images.splice(index, 1);

    this.createComment?.get('images')?.setValue(images);
  }

  openSignInModal(): void {
    this.#appComponent.openSignInModal();
  }

  hasError(field: string, form: FormGroup = this.createComment): boolean {
    return this.#validatorsService.hasError(form, field);
  }

  getError(field: string, form: FormGroup = this.createComment): string | undefined {
    if (!form) return undefined;

    return this.#validatorsService.getError(form, field);
  }
}
