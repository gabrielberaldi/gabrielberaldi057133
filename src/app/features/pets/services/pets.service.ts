import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PetList } from '../models/pet-list.model';
import { Pet } from '../models/pet.model';
import { Filters } from '../../../shared/model/filters.model';
import { PetRequest } from '../models/pet-request.model';
import { Attachment } from '../../../shared/model/attachment.model';

@Injectable({
  providedIn: 'root'
})
export class PetsService {

  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/v1`;
  
  getById(id: number): Observable<Pet> { 
    return this.httpClient.get<Pet>(`${this.apiUrl}/pets/${id}`);
  }

  getAll(filters: Filters): Observable<PetList> { 
    const params = this.params(filters);
    return this.httpClient.get<PetList>(`${this.apiUrl}/pets`, { params });
  }

  create({ id, ...body }: PetRequest): Observable<Pet> { 
    return this.httpClient.post<Pet>(`${this.apiUrl}/pets`, body);
  }

  update({ id, ...body }: PetRequest): Observable<Pet> { 
    return this.httpClient.put<Pet>(`${this.apiUrl}/pets/${id}`, body );
  }

  delete(id: number): Observable<void> { 
    return this.httpClient.delete<void>(`${this.apiUrl}/pets/${id}`);
  }

  uploadAttachment(petId: number, file: File): Observable<Attachment> {
    const formData = new FormData();
    formData.append('foto', file);
    return this.httpClient.post<Attachment>(`${this.apiUrl}/pets/${petId}/fotos`, formData);
  }

  removeAttachment(petId: number, photoId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/pets/${petId}/fotos/${photoId}`);
  } 

  private params(filters: Filters): HttpParams {
    return new HttpParams({
      fromObject: {
        ...filters,
        page: filters.page.toString(),
        size: filters.size.toString()
      }
    })
  }

}
