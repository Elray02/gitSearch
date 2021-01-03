import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, EMPTY, Subject } from 'rxjs';
import { GitResponse } from 'src/app/model/gitResponse.model';
import { GitSearchService } from 'src/app/services/gitSearch.service';
import {
  catchError,
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
import { cardAnimation } from '../../animation';

@Component({
  selector: 'app-home-page',
  templateUrl: './homePage.component.html',
  styleUrls: ['./homePage.component.less'],
  animations: [cardAnimation],
})
export class HomePageComponent implements OnInit {
  inputSearch: Subject<string> = new Subject<string>();
  userSubject$: BehaviorSubject<UserProfile[]> = new BehaviorSubject<
    UserProfile[]
  >([]);
  userList = this.userSubject$.asObservable();
  skeletonVisible = false;

  showLoader: Subject<boolean> = new Subject<boolean>();
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  constructor(private service: GitSearchService) {}

  ngOnInit() {
    this.userList = combineLatest([this.userSubject$, this.inputSearch]).pipe(
      map((mix: [UserProfile[], string]) => mix[1]),
      debounceTime(400),
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
      }),
      catchError((err) => {
        this.errorMessageSubject.next(err);
        return EMPTY;
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
