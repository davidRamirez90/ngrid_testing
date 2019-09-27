import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Renderer
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
  distinctUntilChanged,
  share
} from 'rxjs/operators';
import { User, Post, ExtendedPost } from 'src/app/interfaces/app';
import {
  createDS,
  columnFactory,
  PblNgridComponent,
  PblNgridSortOrder,
  PblColumn
} from '@pebula/ngrid';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, Actions, ofActionSuccessful, Select } from '@ngxs/store';
import { AppState } from 'src/app/store/posts.state';
import { LoadPosts, LoadPosts2 } from 'src/app/store/posts.actions';
import { PblNgridRowEvent } from '@pebula/ngrid/target-events';

const titleFilter = (filterValue: string, title: string) =>
  title.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1;
const idFilter = (filterValue: string, id: number) => {
  console.log(id);

  return String(id).indexOf(filterValue.toLowerCase()) !== -1;
};
const nameFilter = (filterValue: string, name: string) =>
  name.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1;
const usernameFilter = (filterValue: string, username: string) =>
  username.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1;

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
    private actions$: Actions,
    private renderer: Renderer
  ) {
    this.store
      .dispatch(new LoadPosts2())
      .pipe(tap(d => console.log(d)))
      .subscribe();
  }

  myPredicate;
  errorMessage: string;
  searchTerm: string;

  @Select(AppState.getPosts) test$: Observable<ExtendedPost[]>;

  @ViewChild('filterInput', { static: false })
  finput: ElementRef;

  filterString$: Observable<any>;

  // test$: Observable<ExtendedPost[]>;

  // posts$ = this.apiService.postsWithUsers$.pipe(
  //   catchError(error => {
  //     this.errorMessage = error;
  //     return of(null);
  //   })
  // );

  // filtPosts$ = this.apiService.filteredPosts$.pipe(
  //   // tap(console.log),
  //   catchError(error => {
  //     this.errorMessage = error;
  //     return of(null);
  //   })
  // );

  // selPost$ = this.apiService.selectedPost$.pipe(
  //   catchError(error => {
  //     this.errorMessage = error;
  //     return of(null);
  //   })
  // );

  // userIdLists$ = this.posts$.pipe(
  //   map((posts: ExtendedPost[]) => posts.map((post: ExtendedPost) => post.userId)),
  //   map(arr => [...new Set(arr)])
  // );

  // vm$ = combineLatest([this.posts$, this.userIdLists$]).pipe(
  //   filter(([post]) => !!post),
  //   map(([posts, userIdsList]) => ({ posts, userIdsList }))
  // );

  // PBL

  a = '';
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
    this.filterString$ = fromEvent<KeyboardEvent>(
      this.finput.nativeElement,
      'keyup'
    ).pipe(
      tap(d => console.log(d)),
      map(event => (event.target as HTMLInputElement).value),
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      share()
    );
    this.filterString$
      .pipe(
        tap(data => (this.a = data)),
        tap(d => this.ds.syncFilter())
      )
      .subscribe();

    this.myPredicate = (item: any, columns: PblColumn[]): boolean => {
      const title = this.ds.hostGrid.columnApi.findColumn('title').getValue(item);
      const name = this.ds.hostGrid.columnApi.findColumn('userData.name').getValue(item);
      const username = this.ds.hostGrid.columnApi
        .findColumn('userData.username')
        .getValue(item);

      return (
        title.toLowerCase().indexOf(this.a.toLowerCase()) !== -1 ||
        name.toLowerCase().indexOf(this.a.toLowerCase()) !== -1 ||
        username.toLowerCase().indexOf(this.a.toLowerCase()) !== -1
      );
    };

    this.ds.setFilter(this.myPredicate);

    // this.test$ = this.filterString$.pipe(
    //   tap(s => console.log(s)),
    //   switchMap(searchString =>
    //     this.store
    //       .select(AppState.getPostsWithFilter(searchString))
    //       .pipe(tap(d => console.log(d)))
    //   )
    // );
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

  clearSort() {
    // this.ds.setSort()
    this.ds.setFilter();
  }

  onClickEvents(event: PblNgridRowEvent<ExtendedPost>) {
    console.log(event.row.id);
  }

  manualSorting() {
    const currentSort = this.ds.sort;
    const order: PblNgridSortOrder = 'desc';
    const key = 'id';

    // IF IM RECLICKING COLUMN THAT HAS ALREADY GOT SORTING ACTIVE
    this.ds.hostGrid.setSort(key, { order: order });
    this.ds.refresh();

    console.log(currentSort);
  }

  clearFilter() {
    this.finput.nativeElement.value = '';
    const e = new KeyboardEvent('keyup');
    this.renderer.invokeElementMethod(this.finput.nativeElement, 'dispatchEvent', [e]);
  }
}
