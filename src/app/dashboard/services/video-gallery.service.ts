import { environments } from '@env/environments';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { MediaCollection, MediaType } from '@dashboard/enums';
import { Observable } from 'rxjs';
import { VideoGallery } from '@dashboard/interfaces';

@Injectable({
  providedIn: 'root'
})
export class VideoGalleryService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getAllCarVideos$(auctionId: string, type: MediaType): Observable<VideoGallery> {
    return this.#http.get<VideoGallery>(`${this.#baseUrl}/auctions-cars/all-videos?auctionId=${auctionId}&type=${type}`);
  }

  saveVideos$(auctionId: string, videos: string[], type: MediaType): Observable<void> {
    return this.#http.post<void>(`${this.#baseUrl}/videos-publish/save`, {
      type,
      auctionId,
      videos
    });
  }

  addVideosToLibrary$(auctionId: string, type: MediaType, collection: MediaCollection, photoUrls: string[], videoUrls: string[]): Observable<void> {
    return this.#http.post<void>(`${this.#baseUrl}/auctions-cars/add-photos-videos`, {
      auctionId,
      type,
      collection,
      photoUrls,
      videoUrls
    });
  }

  // /videos-publish/all-videos?type=car&auctionId=671960268ce4a97871b8a905
  getAllVideos$(auctionId: string, type: MediaType): Observable<{ data: VideoGallery }> {
    return this.#http.get<{ data: VideoGallery }>(`${this.#baseUrl}/videos-publish/all-videos?type=${type}&auctionId=${auctionId}`);
  }
}
