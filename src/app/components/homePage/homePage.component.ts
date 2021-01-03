import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GitResponse } from 'src/app/model/gitResponse.model';
import { GitSearchService } from 'src/app/services/gitSearch.service';
import {
  concatMap,
  debounceTime,
  filter,
  map,
  switchMap,
  takeWhile,
  tap,
  toArray,
} from 'rxjs/operators';
import { GitUser } from 'src/app/model/gitUser.model';
import { UserProfile } from 'src/app/model/userProfile.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './homePage.component.html',
  styleUrls: ['./homePage.component.less'],
})
export class HomePageComponent implements OnInit {
  userSubject$: Subject<UserProfile[]> = new Subject<UserProfile[]>();
  inputSearch: Subject<string> = new Subject<string>();
  userList = this.userSubject$.asObservable();

  skeletonVisible = false;

  showLoader: Subject<boolean> = new Subject<boolean>();

  constructor(private service: GitSearchService) {}

  ngOnInit() {
    this.userList = this.inputSearch.pipe(
      debounceTime(500),
      filter((newSearch: string) => newSearch !== ''),
      tap((x) => {
        this.showLoader.next(true);
        this.showSkelet();
      }),
      switchMap((newSearch: string) =>
        this.service.gitUserSearch(newSearch).pipe(
          takeWhile((r: GitResponse) => r.total_count > 0),
          map((r: GitResponse) => r.items),
          switchMap((users: GitUser[]) => users.map((u) => u.url)),
          concatMap((userLink: string) =>
            this.service.gitUserInfomation(userLink)
          ),
          toArray()
        )
      ),
      tap((x) => {
        this.showLoader.next(false);
        this.showSkelet();
      })
    );
  }

  showSkelet() {
    this.skeletonVisible = !this.skeletonVisible;
  }

  searchValue(newSearch: string) {
    this.inputSearch.next(newSearch);
  }
}
