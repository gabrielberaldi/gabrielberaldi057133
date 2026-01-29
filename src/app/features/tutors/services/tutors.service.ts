import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Filters } from '../../../shared/model/filters.model';
import { TutorList } from '../models/tutor-list.model';
import { Tutor } from '../models/tutor.model';
import { Attachment } from '../../../shared/model/attachment.model';
import { TutorRequest } from '../models/tutor-request.model';

@Injectable({
  providedIn: 'root'
})
export class TutorsService {

  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/v1`;
    
  getById(id: number): Observable<Tutor> { 
    return this.httpClient.get<Tutor>(`${this.apiUrl}/tutores/${id}`);
  }

  getAll(filters: Filters): Observable<TutorList> { 
    const params = this.params(filters);
    return this.httpClient.get<TutorList>(`${this.apiUrl}/tutores`, { params });
  }

  create({ id, ...body }: TutorRequest): Observable<Tutor> { 
    return this.httpClient.post<Tutor>(`${this.apiUrl}/tutores`, body);
  }

  update({ id, ...body }: TutorRequest): Observable<Tutor> { 
    return this.httpClient.put<Tutor>(`${this.apiUrl}/tutores/${id}`, body );
  }

  delete(id: number): Observable<void> { 
    return this.httpClient.delete<void>(`${this.apiUrl}/tutores/${id}`);
  }

  uploadAttachment(tutorId: number, file: File): Observable<Attachment> {
    const formData = new FormData();
    formData.append('foto', file);
    return this.httpClient.post<Attachment>(`${this.apiUrl}/tutores/${tutorId}/fotos`, formData);
  }

  removeAttachment(tutorId: number, photoId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/tutores/${tutorId}/fotos/${photoId}`);
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
