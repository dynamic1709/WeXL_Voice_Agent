import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl + '/api';
  private userSubject: BehaviorSubject<any | null>;
  public user: Observable<any | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  login(credentials: any) {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(tap(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  registerUser(user: User) {
    return this.http.post<any>(`${this.apiUrl}/users/register`, user);
  }

  getUserProfile() {
    return this.http.get<any>(`${this.apiUrl}/users/me`);
  }

  deleteProfile() {
    return this.http.delete<any>(`${this.apiUrl}/users/me`)
      .pipe(tap(() => {
        // After successful deletion on backend, clear local state
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/register']);
      }));
  }
}
