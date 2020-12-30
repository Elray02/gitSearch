import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GitResponse } from '../model/gitResponse.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GitSearchService {
  constructor(private http: HttpClient) {}

  gitUserSearch = (query: string): Observable<GitResponse> => {
    const url = `https://api.github.com/search/repositories?q=${query}`;
    return this.http.get<GitResponse>(url);
  };
}
