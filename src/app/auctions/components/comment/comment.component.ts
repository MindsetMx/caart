import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject, input, signal } from '@angular/core';
import { GetCommentsData } from '@auctions/interfaces';
import { CommentsService } from '@auctions/services/comments.service';
import { CommentsTextareaComponent } from '../comments-textarea/comments-textarea.component';

@Component({
  selector: 'comment',
  standalone: true,
  imports: [
    CommonModule,
    CommentsTextareaComponent
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent {
  comment = input.required<GetCommentsData>();
  auctionCarPublishId = input.required<string>();
  @Output() commentCreated = new EventEmitter<void>();

  replyIsOpen = signal<boolean>(false);
  responsesIsOpen = signal<boolean>(false);

  #comments = inject(CommentsService);

  likeComment(): void {
    this.#comments.likeComment(this.comment().id).subscribe({
      next: (response) => {
        console.log({ response });
        // this.comment().attributes.likesCount++;
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
