import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private readonly TOKEN_KEY = 'auth_token';

  constructor() {}

  /**
   * Save JWT token to localStorage
   */
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Retrieve JWT token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Clear JWT token from localStorage
   */
  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Check if user is authenticated (has a valid token)
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    // Basic token validation - check if token exists and is not expired
    // In a real app, you might want to decode and validate the JWT expiration
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Check if token is expired
      if (payload.exp && payload.exp < currentTime) {
        this.clearToken();
        return false;
      }
      
      return true;
    } catch (error) {
      // If token is invalid format, clear it
      this.clearToken();
      return false;
    }
  }

  /**
   * Get username from JWT token
   */
  getUsername(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Try different possible fields for username
      return payload.sub || payload.username || payload.email?.split('@')[0] || payload.name || null;
    } catch (error) {
      return null;
    }
  }
}

