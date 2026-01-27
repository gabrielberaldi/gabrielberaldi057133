import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PetList } from '../models/pet-list.model';
import { Pet } from '../models/pet.model';
import { PetDetail } from '../models/pet-detail.model';
import { Filters } from '../../../shared/model/filters.model';

@Injectable({
  providedIn: 'root'
})
export class PetsService {

  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/v1`;
  
  getById(id: string): Observable<PetDetail> { 
    return this.httpClient.get<PetDetail>(`${this.apiUrl}/pets/${id}`);
  }

  getAll(filters: Filters): Observable<PetList> { 
    const params = this.params(filters);
    return this.httpClient.get<PetList>(`${this.apiUrl}/pets`, { params });
  }

  create(pet: number): Observable<Pet> { 
    return this.httpClient.post<Pet>(`${this.apiUrl}/pets`, { });
  }

  update(id: number): Observable<Pet> { 
    return this.httpClient.put<Pet>(`${this.apiUrl}/pets/${id}`, { });
  }

  delete(id: number): Observable<void> { 
    return this.httpClient.delete<void>(`${this.apiUrl}/pets/${id}`);
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
