import { CommonModule } from '@angular/common';
import { Fancybox } from "@fancyapps/ui";
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Output, inject, input, signal } from '@angular/core';

import { GetCommentsData } from '@auctions/interfaces';
import { CommentsService } from '@auctions/services/comments.service';
import { CommentsTextareaComponent } from '@auctions/components/comments-textarea/comments-textarea.component';
import { ThumbsUpOutlineComponent } from '@shared/components/icons/thumbs-up-outline/thumbs-up-outline.component';
import { AuctionTypes } from '@auctions/enums/auction-types';
import { AuctionTypesComments } from '@auctions/enums';
import { UserData } from '@auth/interfaces';
import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';
import { AppComponent } from '@app/app.component';

@Component({
  selector: 'comment',
  standalone: true,
  imports: [
    CommonModule,
    CommentsTextareaComponent,
    ThumbsUpOutlineComponent
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent implements AfterViewInit {
  comment = input.required<GetCommentsData>();
  auctionCarPublishId = input.required<string>();
  auctionType = input.required<AuctionTypes>();
  auctionTypeComment = input.required<AuctionTypesComments>();
  @Output() commentCreated = new EventEmitter<void>();

  replyIsOpen = signal<boolean>(false);
  responsesIsOpen = signal<boolean>(false);
  uniqueId = signal<string>(window.crypto.getRandomValues(new Uint32Array(1))[0].toString());

  #comments = inject(CommentsService);
  #authService = inject(AuthService);
  #appComponent = inject(AppComponent);

  get user(): UserData | null {
    return this.#authService.currentUser();
  }

  get authStatus(): AuthStatus {
    return this.#authService.authStatus();
  }

  ngAfterViewInit(): void {
    Fancybox.bind("[data-fancybox='gallery" + this.uniqueId() + "']", { Hash: false });
  }

  likeComment(commentId = this.comment().id): void {
    if (this.authStatus === AuthStatus.notAuthenticated) {
      this.openSignInModal();

      return;
    }

    this.#comments.likeComment$(commentId).subscribe({
      next: () => {
        this.commentCreated.emit();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  toggleReply(): void {
    this.replyIsOpen.update((value) => !value);
  }

  toggleResponses(): void {
    this.responsesIsOpen.update((value) => !value);
  }

  emitCommentCreated(): void {
    this.commentCreated.emit();
  }

  openSignInModal(): void {
    this.#appComponent.openSignInModal();
  }
}
