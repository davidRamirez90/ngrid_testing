import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError, combineLatest, Subject, Observable } from 'rxjs';
import { tap, catchError, map, shareReplay, filter, startWith } from 'rxjs/operators';
import { Post, User, ExtendedPost } from '../interfaces/app';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private postsUrl = 'https://jsonplaceholder.typicode.com/posts';
  private usersUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) {}

  // ACTION STREAMS
  // Subjects are like event emitters (multicast) can be Observable and Observer
  private postSelectedAction = new Subject<number>();
  postSelectedAction$ = this.postSelectedAction.asObservable();

  private applySelectedFilter = new Subject<string>();
  applySelectedFilter$ = this.applySelectedFilter.asObservable().pipe(startWith(''));

  // DATA STREAMS
  posts$ = this.http.get<Post[]>(this.postsUrl, httpOptions).pipe(
    // tap(console.log),
    shareReplay(1),
    catchError(this.handleError)
  );

  users$ = this.http.get<User[]>(this.usersUrl, httpOptions).pipe(
    // tap(console.log),
    shareReplay(1),
    catchError(this.handleError)
  );

  postsWithUsers$ = combineLatest(this.posts$, this.users$).pipe(
    map(([posts, users]) =>
      posts.map(
        p => ({ ...p, userData: users.find(u => p.userId === u.id) } as ExtendedPost)
      )
    )
  );

  selectedPost$ = combineLatest(this.postSelectedAction$, this.postsWithUsers$).pipe(
    map(([selectedPostId, posts]) => posts.find(post => post.id === selectedPostId))
  );

  filteredPosts$ = combineLatest(this.applySelectedFilter$, this.postsWithUsers$).pipe(
    tap(([filterStr, posts]) => console.log(filterStr)),
    map(([filterStr, posts]) =>
      posts.filter(post => {
        return (
          post.title.toLowerCase().indexOf(filterStr.toLowerCase()) !== -1 ||
          String(post.id).indexOf(filterStr.toLowerCase()) !== -1 ||
          post.userData.name.toLowerCase().indexOf(filterStr.toLowerCase()) !== -1 ||
          post.userData.username.toLowerCase().indexOf(filterStr.toLowerCase()) !== -1
        );
      })
    )
  );

  fullObj$ = combineLatest(this.postSelectedAction);

  // METHODS

  changeSelectedPost(selectedPostId: number | null): void {
    this.postSelectedAction.next(selectedPostId);
  }

  applyFilter(filterString: string | null): void {
    this.applySelectedFilter.next(filterString);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
