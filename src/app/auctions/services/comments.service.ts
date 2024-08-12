import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuctionTypes, AuctionTypesComments } from '@auctions/enums';
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

  createComment(body: FormGroup, itemType: string = AuctionTypes.car, auctionType: AuctionTypesComments): Observable<any> {
    return this.#http.post<any>(`${this.#baseUrl}/comments`, {
      text: body.value.text,
      isBid: body.value.isBid,
      isSeller: body.value.isSeller,
      itemId: body.value.itemId,
      images: body.value.images,
      parentCommentId: body.value.parentCommentId,
      itemType,
      auctionType
    });
  }

  // http://localhost:3000/comments/art/66b05da8700b8b62c060badd/active?page=1&size=10&orderBy=dateCreated&orderDirection=desc
  getComments$(auctionCarPublishId: string, itemType: string, auctionType: AuctionTypesComments, page: number = 1, size: number = 10): Observable<GetComments> {
    // return this.#http.get<GetComments>(`${this.#baseUrl}/comments/${itemType}/${auctionCarPublishId}/${auctionType}`);

    return this.#http.get<GetComments>(`${this.#baseUrl}/comments/${itemType}/${auctionCarPublishId}/${auctionType}?page=${page}&size=${size}&orderBy=dateCreated&orderDirection=desc`);
  }

  likeComment$(commentId: string): Observable<LikeComment> {
    return this.#http.post<any>(`${this.#baseUrl}/comments/${commentId}/like`, {});
  }

  // http://localhost:3000/comments/mark-as-read  Patch
  // {
  //   "commentIds": ["66b3bfe1a3905f865b73f0e8"]
  // }
  markAsRead$(commentIds: string[]): Observable<any> {
    return this.#http.patch<any>(`${this.#baseUrl}/comments/mark-as-read`, { commentIds });
  }
}
