import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { LoginResp } from '../interfaces/login-resp.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { catchError, map, tap } from 'rxjs/operators';
import { tokenHeader } from '../utils/getConfig';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  checkToken(): Observable<boolean> {
    return this.http
      .get<LoginResp>(`${base_url}/users/check-auth-status`, {
        headers: tokenHeader.headers,
      })
      .pipe(
        tap((resp) => {
          localStorage.setItem('token', resp.token);
        }),
        map((resp) => true),
        catchError((error) => of(false))
      );
  }

  createUser(formData: RegisterForm): Observable<LoginResp> {
    return this.http.post<LoginResp>(`${base_url}/users`, formData).pipe(
      tap((resp) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  login(formData: LoginForm): Observable<LoginResp> {
    return this.http.post<LoginResp>(`${base_url}/users/login`, formData).pipe(
      tap((resp) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }
}
