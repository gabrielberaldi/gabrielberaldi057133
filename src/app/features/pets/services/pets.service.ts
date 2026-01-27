import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PetList } from '../models/pet-list.model';
import { Pet } from '../models/pet.model';
import { PetDetail } from '../models/pet-detail.model';

@Injectable({
  providedIn: 'root'
})
export class PetsService {

  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  
  getById(id: string): Observable<PetDetail> { 
    return this.httpClient.get<PetDetail>(`${this.apiUrl}/pets/${id}`);
  }

  getAll(): Observable<PetList> { 
    return this.httpClient.get<PetList>(`${this.apiUrl}/pets`);
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

}
