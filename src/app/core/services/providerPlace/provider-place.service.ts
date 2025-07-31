import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { UrlServiceService } from '../url/url-service.service';

@Injectable({
  providedIn: 'root',
})
export class ProviderPlaceService {
  constructor(
    private http: HttpClient,
    private urlService: UrlServiceService
  ) {}

  addPlace(formData: FormData): Observable<any> {
    return this.http.post(`${environment.baseUrl}/Place/add`, formData);
  }

  getPlaceById(id: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}/place/${id}`);
  }
  updatePlace(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${environment.baseUrl}/place/edit/${id}`, formData);
  }

  getMyPlaces(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/Place/my-places`);
  }

  loadPlaceForEdit(
    placeId: number
  ): Observable<{ formData: any; currentFiles: any }> {
    return this.getPlaceById(placeId.toString()).pipe(
      map((place) => {
        const formData = {
          placeTypeName: place.placeTypeName,
          location: place.location,
          latitude: place.latitude,
          longitude: place.longitude,
          maxAttendees: place.maxAttendees,
          price: place.price,
          stripePaymentLink: place.stripePaymentLink,
        };

        const currentFiles = {
          imageUrl: this.urlService.getFullUrl(place.imageUrl),
          securityClearanceUrl: this.urlService.getFullUrl(
            place.securityClearanceUrl
          ),
          ownershipOrRentalContractUrl: this.urlService.getFullUrl(
            place.ownershipOrRentalContractUrl
          ),
          nationalIdFrontUrl: this.urlService.getFullUrl(
            place.nationalIdFrontUrl
          ),
          nationalIdBackUrl: this.urlService.getFullUrl(
            place.nationalIdBackUrl
          ),
        };

        return { formData, currentFiles };
      })
    );
  }

  deletePlace(id: string): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/place/${id}`);
  }

  getPlaceTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.baseUrl}/place-types`);
  }
}
