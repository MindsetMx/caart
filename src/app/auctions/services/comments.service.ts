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
      parentCommentId: body.value.parentCommentId,
      itemType,
      auctionType
    });
  }

  getComments(auctionCarPublishId: string, itemType: string, auctionType: AuctionTypesComments): Observable<GetComments> {
    return this.#http.get<GetComments>(`${this.#baseUrl}/comments/${itemType}/${auctionCarPublishId}/${auctionType}`); //TODO: cambiar a variable
  }

  likeComment(commentId: string): Observable<LikeComment> {
    return this.#http.post<any>(`${this.#baseUrl}/comments/${commentId}/like`, {});
  }
}
