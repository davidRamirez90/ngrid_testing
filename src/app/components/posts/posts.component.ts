import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { Observable, of, combineLatest, from, forkJoin, fromEvent } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import {
  catchError,
  tap,
  map,
  filter,
  distinct,
  switchMap,
  startWith,
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators';
import { User, Post, ExtendedPost } from 'src/app/interfaces/app';
import { createDS, columnFactory, PblNgridComponent } from '@pebula/ngrid';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, Actions, ofActionSuccessful, Select } from '@ngxs/store';
import { AppState } from 'src/app/store/posts.state';
import { LoadPosts, LoadPosts2 } from 'src/app/store/posts.actions';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostsComponent implements OnInit, AfterViewInit {
  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store,
    private actions$: Actions
  ) {
    this.test$ = this.store
      .select(AppState.getPostsWithFilter(' '))
      .pipe(tap(d => console.log(d)));

    this.store
      .dispatch(new LoadPosts2())
      .pipe(tap(console.log))
      .subscribe();
  }
  errorMessage: string;
  searchTerm: string;

  // @Select(AppState.getPosts) test$: Observable<ExtendedPost[]>;

  @ViewChild('filterInput', { static: false })
  finput: ElementRef;

  filterString$: Observable<any>;

  test$: Observable<ExtendedPost[]>;

  posts$ = this.apiService.postsWithUsers$.pipe(
    // tap(console.log),
    catchError(error => {
      this.errorMessage = error;
      return of(null);
    })
  );

  // filtPosts$ = this.apiService.filteredPosts$.pipe(
  //   // tap(console.log),
  //   catchError(error => {
  //     this.errorMessage = error;
  //     return of(null);
  //   })
  // );

  selPost$ = this.apiService.selectedPost$.pipe(
    // tap(console.log),
    catchError(error => {
      this.errorMessage = error;
      return of(null);
    })
  );

  userIdLists$ = this.posts$.pipe(
    map((posts: ExtendedPost[]) => posts.map((post: ExtendedPost) => post.userId)),
    map(arr => [...new Set(arr)])
  );

  vm$ = combineLatest([this.posts$, this.userIdLists$]).pipe(
    filter(([post]) => !!post),
    map(([posts, userIdsList]) => ({ posts, userIdsList }))
    // tap(console.log)
  );

  // PBL NGRID

  columns = columnFactory()
    .table(
      { prop: 'selection', minWidth: 40, maxWidth: 50 },
      { prop: 'id', width: '40px', sort: true },
      { prop: 'title', sort: true },
      { prop: 'userData.name', sort: true },
      { prop: 'userData.username', sort: true }
    )
    .build();

  ds = createDS<ExtendedPost>()
    .onTrigger(() => this.test$)
    .create();

  ngAfterViewInit(): void {
    console.log(this.finput);

    this.test$ = fromEvent<KeyboardEvent>(this.finput.nativeElement, 'keyup').pipe(
      tap(console.log),
      map(event => event.target.value),
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(searchString =>
        this.store
          .select(AppState.getPostsWithFilter(searchString))
          .pipe(tap(d => console.log(d)))
      )
    );
  }

  ngOnInit(): void {
    // this.store.dispatch(new LoadPosts());
    // this.actions$.pipe(ofActionSuccessful(LoadPosts)).subscribe();
  }

  postSelected(selectedPostId: number) {
    this.apiService.changeSelectedPost(selectedPostId);
  }

  print(something: any) {
    console.log(something);
  }

  printDs() {
    console.log(this.ds);
  }

  filterChanged(term, col) {
    this.apiService.applyFilter(term);
  }

  clearFilter() {
    this.apiService.applyFilter('');
    this.searchTerm = '';
  }
}
