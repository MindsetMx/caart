import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
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

  createComment(body: FormGroup): Observable<any> {
    return this.#http.post<any>(`${this.#baseUrl}/comments`, body.value);
  }

  getComments(auctionCarPublishId: string): Observable<GetComments> {
    return this.#http.get<GetComments>(`${this.#baseUrl}/comments/${auctionCarPublishId}`);
  }

  likeComment(commentId: string): Observable<LikeComment> {
    return this.#http.post<any>(`${this.#baseUrl}/comments/${commentId}/like`, {});
  }
}
