import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuctionTypes } from '@auctions/enums/auction-types';
import { GetComments } from '@auctions/interfaces/get-comments';
import { LikeComment } from '@auctions/interfaces/like-comment';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  createComment(body: FormGroup, itemType: string = AuctionTypes.car): Observable<any> {
    return this.#http.post<any>(`${this.#baseUrl}/comments`, {
      text: body.value.text,
      isBid: body.value.isBid,
      isSeller: body.value.isSeller,
      itemId: body.value.itemId,
      parentCommentId: body.value.parentCommentId,
      itemType,
    });
  }

  getComments(auctionCarPublishId: string, itemType: string = AuctionTypes.car): Observable<GetComments> {
    return this.#http.get<GetComments>(`${this.#baseUrl}/comments/${itemType}/${auctionCarPublishId}`);
  }

  likeComment(commentId: string): Observable<LikeComment> {
    return this.#http.post<any>(`${this.#baseUrl}/comments/${commentId}/like`, {});
  }
}
