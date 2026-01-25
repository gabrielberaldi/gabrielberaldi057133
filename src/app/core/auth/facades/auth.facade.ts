import { inject, Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { UserCredentials } from "../models/user-credentials.model";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { AuthResponse } from "../models/auth-response.model";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AuthFacade { 

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  
  private readonly authKey = 'auth_data';
  private readonly authDataSubject$ = new BehaviorSubject<AuthResponse | null>(this.loadFromStorage());
  
  get accessToken(): string | null {
    const authData = this.authDataSubject$.getValue();
    return authData ? authData.access_token : null;
  }

  login(userCredentials: UserCredentials) {
    return this.authService.login(userCredentials).pipe(
      tap(response => {
        this.updateSession(response);
        this.router.navigate(['/layout']);
      })
    ).subscribe();
  }

  logout(): void {
    this.authDataSubject$.next(null);
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<AuthResponse> { 
    const refreshToken = this.authDataSubject$.getValue()?.refresh_token;
    if (!refreshToken) throw new Error('Sem refresh token disponível');
    return this.authService.refreshToken(refreshToken).pipe
      (tap(response => this.updateSession(response))
    );
  }

  
  private loadFromStorage(): AuthResponse | null { 
    const saved = localStorage.getItem(this.authKey);
    return saved ? JSON.parse(saved) : null;
  }
  
  private updateSession(response: AuthResponse): void { 
    localStorage.setItem(this.authKey, JSON.stringify(response));
    this.authDataSubject$.next(response);
  } 
}