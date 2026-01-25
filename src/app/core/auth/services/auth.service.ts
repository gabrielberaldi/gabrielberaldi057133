import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/auth-response.model';
import { environment } from '../../../../environments/environment';
import { UserCredentials } from '../models/user-credentials.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = environment.apiUrl;
  private readonly httpClient = inject(HttpClient);

  login(userCredentials: UserCredentials): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.apiUrl}/autenticacao/login`, userCredentials);
  }

  refreshToken(refreshToken: string): Observable<AuthResponse> { 
    const headers = new HttpHeaders({ Authorization: `Bearer ${refreshToken}` });
    return this.httpClient.put<AuthResponse>(`${this.apiUrl}/autenticacao/refresh`, null, { headers });
  }

}
