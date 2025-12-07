import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of, tap, throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CurrentUserService } from './current-user.service';
import {GatewayService} from './gateway.service';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id_token: string;
  refresh_token: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // In a real app, this would be your actual API endpoint
  private readonly API_URL;

  constructor(
    private http: HttpClient,
    private gatewayService: GatewayService,
    private currentUserService: CurrentUserService
  ) {
    this.API_URL = gatewayService.getUserServiceUrlPrefix() + "/api/authenticate";
    console.log(this.API_URL);
  }

  /**
   * Login user with username and password
   * For demo purposes, this uses mock authentication
   * In production, replace with actual API call
   */
  login(username: string, password: string): Observable<LoginResponse> {
    // Mock authentication for demo
    // In production, replace this with actual HTTP call:
    // return this.http.post<LoginResponse>(this.API_URL, {username: username, password: password})

    // Mock successful login for demo
    if (username && password.length >= 4) {
      // Generate a mock JWT token (in production, this comes from the backend)
      // const mockToken = this.generateMockToken(username);
      // const response: LoginResponse = {
      //   token: mockToken,
      //   user: {
      //     id: '1',
      //     email: username,
      //     name: username.split('@')[0]
      //   }
      // };

      // Save token to CurrentUserService
      return this.http.post<LoginResponse>(this.API_URL, {username: username, password: password})
        .pipe(
          tap(response => this.currentUserService.saveToken(response.id_token))
        );
    } else {
      return throwError(() => new Error('Invalid credentials'));
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    this.currentUserService.clearToken();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUserService.isAuthenticated();
  }

  /**
   * Generate a mock JWT token for demo purposes
   * In production, tokens come from the backend
   */
  private generateMockToken(email: string): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const payload = {
      sub: email,
      email: email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };

    const base64Header = btoa(JSON.stringify(header));
    const base64Payload = btoa(JSON.stringify(payload));
    const signature = 'mock_signature_for_demo';

    return `${base64Header}.${base64Payload}.${signature}`;
  }
}

