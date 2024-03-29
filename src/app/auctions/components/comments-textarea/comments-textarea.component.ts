import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, inject, input, signal } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentsService } from '@auctions/services/comments.service';
import { AuthStatus } from '@auth/enums';
import { UserData } from '@auth/interfaces';
import { AuthService } from '@auth/services/auth.service';
import { AutoResizeTextareaDirective, PrimaryButtonDirective } from '@shared/directives';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { AppComponent } from '@app/app.component';
import { AuctionTypes } from '@auctions/enums/auction-types';

@Component({
  selector: 'comments-textarea',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AutoResizeTextareaDirective,
    PrimaryButtonDirective,
    SpinnerComponent
  ],
  templateUrl: './comments-textarea.component.html',
  styleUrls: ['./comments-textarea.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsTextareaComponent implements OnInit {
  auctioneerUserId = input<string>();
  auctionCarPublishId = input.required<string>();
  parentCommentId = input<string>();
  rows = input<number>(4);
  isSeller = input<boolean>();
  placeholder = input.required<string>();
  auctionType = input.required<AuctionTypes>();

  @Output() commentCreated = new EventEmitter<void>();

  createCommentButtonIsDisabled = signal<boolean>(false);

  #formBuilder = inject(FormBuilder);
  #authService = inject(AuthService);
  #commentsService = inject(CommentsService);
  #validatorsService = inject(ValidatorsService);
  #appComponent = inject(AppComponent);

  createComment?: FormGroup;

  get authStatus(): AuthStatus {
    return this.#authService.authStatus();
  }

  ngOnInit(): void {
    this.createComment = this.#formBuilder.group({
      text: ['', Validators.required],
      isBid: [false, Validators.required],
      isSeller: [this.isSeller() || this.user?.id === this.auctioneerUserId(), Validators.required],
      itemId: [this.auctionCarPublishId(), Validators.required],
      parentCommentId: [this.parentCommentId() || null],
    });
  }

  get user(): UserData | null {
    return this.#authService.currentUser();
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

    this.#commentsService.createComment(this.createComment as FormGroup, this.auctionType()).subscribe({
      next: () => {
        this.createComment?.get('text')?.setValue('');
        this.commentCreated.emit();
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.createCommentButtonIsDisabled.set(false);
    });
  }

  openSignInModal(): void {
    this.#appComponent.openSignInModal();
  }
}
