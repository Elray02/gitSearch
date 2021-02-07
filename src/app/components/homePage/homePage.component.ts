import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  iif,
  Observable,
  of,
  Subject,
} from 'rxjs';
import { GitResponse } from 'src/app/model/gitResponse.model';
import { GitSearchService } from 'src/app/services/gitSearch.service';
import {
  catchError,
  concatMap,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  takeWhile,
  tap,
  toArray,
} from 'rxjs/operators';
import { GitUser } from 'src/app/model/gitUser.model';
import { UserProfile } from 'src/app/model/userProfile.model';
import { cardAnimation } from '../../animation';
import { SearchQuery } from 'src/app/model/searchQuery.model';

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

  showLoader: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  paginatorLength: BehaviorSubject<number> = new BehaviorSubject(0);
  showPaginator: Observable<boolean>;

  currentPage: BehaviorSubject<number> = new BehaviorSubject(1);
  indexPaginator = 0;
  totalResult: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(private service: GitSearchService) {}

  ngOnInit() {
    this.userList = combineLatest([
      this.userSubject$,
      this.inputSearch,
      this.currentPage,
    ]).pipe(
      map((mix: [UserProfile[], string, number]) => {
        const newSearch: SearchQuery = { userInput: mix[1], page: mix[2] };
        return newSearch;
      }),
      filter((newSearch: SearchQuery) => newSearch.userInput !== ''),
      tap((x) => {
        this.showLoader.next(true);
        this.showSkelet();
      }),
      debounceTime(400),
      switchMap((newSearch: SearchQuery) =>
        this.service.gitUserSearch(newSearch).pipe(
          takeWhile((r: GitResponse) => r.total_count > 0),
          map((r: GitResponse) => {
            this.totalResult.next(r.total_count);
            this.paginatorLength.next(Math.ceil(r.total_count / 10));
            return r.items;
          }),
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

    this.inputSearch
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((x) => this.resetPagination());

    this.showPaginator = combineLatest([
      this.paginatorLength,
      this.showLoader,
    ]).pipe(
      mergeMap((x: [number, boolean]) =>
        iif(() => x[0] <= 0, of(false), of(!x[1]))
      )
    );
  }

  showSkelet() {
    this.skeletonVisible = !this.skeletonVisible;
  }

  searchValue(newSearch: string) {
    this.inputSearch.next(newSearch);
  }

  goToPage(index: number) {
    this.currentPage.next(index + 1);
    this.indexPaginator = index;
  }

  resetPagination() {
    this.paginatorLength.next(0);
    this.totalResult.next(0);
    this.indexPaginator = 0;
    this.currentPage.next(1);
  }
}
