import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/auth-response.model';
import { environment } from '../../../../environments/environment';
import { UserCredentials } from '../models/user-credentials.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  login(userCredentials: UserCredentials): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.apiUrl}/autenticacao/login`, userCredentials);
  }

}
