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

  showLoader: Subject<boolean> = new Subject<boolean>();
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  paginatorLength = 0;

  currentPage: BehaviorSubject<number> = new BehaviorSubject(1);
  indexPaginator = 0;

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
      debounceTime(400),
      filter((newSearch: SearchQuery) => newSearch.userInput !== ''),
      tap((x) => {
        this.showLoader.next(true);
        this.showSkelet();
      }),
      switchMap((newSearch: SearchQuery) =>
        this.service.gitUserSearch(newSearch).pipe(
          tap((x) => console.log(x)),
          takeWhile((r: GitResponse) => r.total_count > 0),
          map((r: GitResponse) => {
            this.paginatorLength = Math.ceil(r.total_count / 10);
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

    combineLatest([
      this.inputSearch.pipe(
        debounceTime(100),
        filter((newSearch: string) => newSearch === '')
      ),
      this.userList.pipe(
        filter((newSearch: UserProfile[]) => newSearch.length === 0)
      ),
    ]).subscribe((x) => {
      this.resetPagination();
    });
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
    console.log('New page:', index);
  }

  resetPagination() {
    this.indexPaginator = 0;
  }
}
