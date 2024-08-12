import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { DatePipe, JsonPipe, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';

import { AppService } from '@app/app.service';
import { AuctionTypesComments } from '@auctions/enums';
import { CommentsService } from '@auctions/services/comments.service';
import { GetComments, GetCommentsData } from '@auctions/interfaces';
import { ViewAndReplyCommentModalComponent } from '@activity/modals/view-and-reply-comment-modal/view-and-reply-comment-modal.component';
import { AuctionTypes } from '@auctions/enums/auction-types';

@Component({
  standalone: true,
  imports: [
    MatPaginatorModule,
    NgClass,
    DatePipe,
    JsonPipe,
    ViewAndReplyCommentModalComponent,
  ],
  templateUrl: './my-comments.component.html',
  styleUrl: './my-comments.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCommentsComponent {
  #commentsService = inject(CommentsService);
  #activatedRoute = inject(ActivatedRoute);
  #http = inject(HttpClient);
  #appService = inject(AppService);

  selectedCommentsIds = signal<string[]>([]);
  comments = signal<GetComments>({} as GetComments);
  pageSizeOptions = signal<number[]>([]);
  currentPage = signal<number>(1);
  size = signal<number>(10);
  comment = signal<GetCommentsData>({} as GetCommentsData);
  isCommentModalOpen = signal<boolean>(false);

  auctionType = signal<AuctionTypes | null>(null);
  auctionId = signal<string | null>(null);
  commentAuctionTypes = signal<AuctionTypesComments | null>(null);

  indeterminate = computed(() => this.selectedCommentsIds().length > 0 && this.selectedCommentsIds().length < this.comments().data.length);

  constructor() {
    this.auctionType.set(this.#activatedRoute.snapshot.queryParams['auctionType'] || null);
    console.log({ auctionType: this.auctionType() });

    this.auctionId.set(this.#activatedRoute.snapshot.queryParams['auctionId'] || null);
    this.commentAuctionTypes.set(this.#activatedRoute.snapshot.queryParams['commentAuctionTypes'] || null);
  }

  getCommentsEffect = effect(() => {
    this.getComments();
  });

  openCommentModal(comment: GetCommentsData): void {
    this.comment.set(comment);
    this.isCommentModalOpen.set(true);
  }

  getComments(): void {
    this.#commentsService.getComments$(this.auctionId()!, this.auctionType()!, this.commentAuctionTypes()!, this.currentPage(), this.size()).subscribe((comments) => {
      this.comments.set(comments);
      this.pageSizeOptions.set(this.calculatePageSizeOptions(comments.meta.totalCount));
    });
  }

  commentReplied(): void {
    this.getComments();
    this.isCommentModalOpen.set(false);
    this.toastSuccess('El comentario ha sido respondido');
  }

  markAsRead(): void {
    this.#commentsService.markAsRead$(this.selectedCommentsIds()).subscribe({
      next: () => {
        this.selectedCommentsIds.set([]);
        this.getComments();
        this.toastSuccess('Los comentarios seleccionados se han marcado como leídos');
      },
      error: (error) => {
        console.error({ error });
      },
    });
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedCommentsIds.set(this.comments().data.map((comment: any) => comment.id));
    } else {
      this.selectedCommentsIds.set([]);
    }
  }

  toggleSelection(id: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedCommentsIds.update((selectedCommentsIds) => [...selectedCommentsIds, id]);
    } else {
      this.selectedCommentsIds.update((selectedCommentsIds) => selectedCommentsIds.filter(selectedId => selectedId !== id));
    }
  }

  private calculatePageSizeOptions(totalItems: number): number[] {
    const pageSizeOptions = [];
    if (totalItems > 0) {
      for (let i = this.comments().meta.pageSize; i <= totalItems; i += this.comments().meta.pageSize) {
        pageSizeOptions.push(i);
      }
    }

    return pageSizeOptions;
  }

  onPageChange(event: any): void {
    this.currentPage.set(event.pageIndex + 1);
    this.size.set(event.pageSize);
    // this.getComments();
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }

  toastError(message: string): void {
    this.#appService.toastError(message);
  }
}
