import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { Observable, of, combineLatest, from, forkJoin } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { catchError, tap, map, filter, distinct, switchMap } from 'rxjs/operators';
import { User, Post, ExtendedPost } from 'src/app/interfaces/app';
import { createDS, columnFactory, PblNgridComponent } from '@pebula/ngrid';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostsComponent {
  errorMessage: string;
  searchTerm: string;

  posts$ = this.apiService.postsWithUsers$.pipe(
    // tap(console.log),
    catchError(error => {
      this.errorMessage = error;
      return of(null);
    })
  );

  filtPosts$ = this.apiService.filteredPosts$.pipe(
    tap(console.log),
    catchError(error => {
      this.errorMessage = error;
      return of(null);
    })
  );

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
    map(([posts, userIdsList]) => ({ posts, userIdsList })),
    tap(console.log)
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
    .onTrigger(() => this.filtPosts$)
    .create();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

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
