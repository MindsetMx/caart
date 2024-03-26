import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject, input, signal } from '@angular/core';
import { GetCommentsData } from '@auctions/interfaces';
import { CommentsService } from '@auctions/services/comments.service';
import { CommentsTextareaComponent } from '../comments-textarea/comments-textarea.component';
import { ThumbsUpOutlineComponent } from '@shared/components/icons/thumbs-up-outline/thumbs-up-outline.component';
import { AuctionTypes } from '@auctions/enums/auction-types';

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
export class CommentComponent {
  comment = input.required<GetCommentsData>();
  auctionCarPublishId = input.required<string>();
  auctionType = input.required<AuctionTypes>();
  @Output() commentCreated = new EventEmitter<void>();

  replyIsOpen = signal<boolean>(false);
  responsesIsOpen = signal<boolean>(false);

  #comments = inject(CommentsService);

  likeComment(commentId = this.comment().id): void {
    this.#comments.likeComment(commentId).subscribe({
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
}
