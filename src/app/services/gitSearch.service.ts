import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GitResponse } from '../model/gitResponse.model';
import { Observable, of } from 'rxjs';
import { UserProfile } from '../model/userProfile.model';
import { catchError, tap } from 'rxjs/operators';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { SearchQuery } from '../model/searchQuery.model';
@Injectable({
  providedIn: 'root',
})
export class GitSearchService {
  constructor(
    private http: HttpClient,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService
  ) {}

  gitUserSearch(query: SearchQuery): Observable<GitResponse> {
    console.log(query);
    const url = `https://api.github.com/search/users?q=${query.userInput}+sort:followers+followers:>1000&page=${query.page}&per_page=10`;
    return this.http
      .get<GitResponse>(url)
      .pipe(catchError(this.handleError<any>('search for user')));
  }

  gitUserInfomation(url: string): Observable<UserProfile> {
    return this.http
      .get<UserProfile>(url)
      .pipe(catchError(this.handleError<any>('get user info')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.showNotification(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  showNotification(message: string) {
    this.notificationsService
      .show(`Ups this happen: ${message}`, {
        label: 'What a pity!',
        status: TuiNotification.Error,
        autoClose: false,
      })
      .subscribe();
  }
}
