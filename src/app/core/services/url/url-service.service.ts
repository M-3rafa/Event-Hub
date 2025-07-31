import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UrlServiceService {
  private baseUrl = environment.baseUrl.replace(/\/api\/?$/, '');

  getFullUrl(url: string | null | undefined): string | null {
    if (!url) return null;
    return url.startsWith('http') ? url : `${this.baseUrl}${url}`;
  }

  getFullImageUrl(img: string | null | undefined): string {
    if (!img) return '';
    return img.startsWith('http') ? img : `${this.baseUrl}${img}`;
  }
}
