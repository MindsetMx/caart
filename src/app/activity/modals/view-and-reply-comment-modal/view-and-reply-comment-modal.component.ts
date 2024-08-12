import { ChangeDetectionStrategy, Component, effect, inject, input, model, output, untracked } from '@angular/core';

import { AuctionTypes, AuctionTypesComments } from '@auctions/enums';
import { CommentComponent } from '@auctions/components/comment/comment.component';
import { CommentsService } from '@auctions/services/comments.service';
import { GetCommentsData } from '@auctions/interfaces';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'view-and-reply-comment-modal',
  standalone: true,
  imports: [
    ModalComponent,
    CommentComponent,
  ],
  templateUrl: './view-and-reply-comment-modal.component.html',
  styleUrl: './view-and-reply-comment-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewAndReplyCommentModalComponent {
  isOpen = model.required<boolean>();

  commentReplied = output<void>();
  commentLiked = output<void>();

  comment = model.required<GetCommentsData>();
  auctionId = input.required<string>();
  commentAuctionTypes = input.required<AuctionTypesComments>();
  auctionType = input.required<AuctionTypes>();

  #commentsService = inject(CommentsService);

  commentEffect = effect(() => {
    this.markAsRead();
  });

  emitCommentReplied(): void {
    this.commentReplied.emit();
  }

  emitCommentLiked(): void {
    if (this.comment().attributes.likedByMe) {
      this.comment().attributes.likesCount--;
    } else {
      this.comment().attributes.likesCount++;
    }

    this.comment().attributes.likedByMe = !this.comment().attributes.likedByMe;
  }

  markAsRead(): void {
    this.#commentsService.markAsRead$([this.comment().id]).subscribe({
      next: () => {
        this.commentLiked.emit();
      },
      error: (error) => {
        console.error({ error });
      },
    });
  }
}
