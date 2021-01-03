import { Observable, throwError } from 'rxjs';

import { catchError, filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpInterceptor,
} from '@angular/common/http';

import { TOKEN__GIT } from '../../../token';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private localToken = TOKEN__GIT;

  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!req.headers.has('auth')) {
      req = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + this.localToken),
      });
    }
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(err);
      })
    );
  }
}
