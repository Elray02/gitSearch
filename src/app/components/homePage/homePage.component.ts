import { Component, OnInit } from '@angular/core';
import { iif, Observable, of, Subject } from 'rxjs';
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
  selector: 'app-homePage',
  templateUrl: './homePage.component.html',
  styleUrls: ['./homePage.component.less'],
})
export class HomePageComponent implements OnInit {
  userSubject$: Subject<UserProfile[]> = new Subject<UserProfile[]>();
  inputSearch: Subject<string> = new Subject<string>();
  userList = this.userSubject$.asObservable();

  skeletonVisible = false;

  inputUser = '';
  showLoader: Subject<boolean> = new Subject<boolean>();

  constructor(private service: GitSearchService) {}

  ngOnInit() {
    this.userList = this.inputSearch.pipe(
      debounceTime(500),
      filter((c) => this.inputUser !== ''),
      tap((x) => {
        this.showLoader.next(true);
        this.showSkelet();
      }),
      switchMap(() =>
        this.service.gitUserSearch(this.inputUser).pipe(
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

  searchValue() {
    this.inputSearch.next('');
  }

}
