import {
  Action,
  Selector,
  State,
  StateContext,
  Store,
  createSelector
} from '@ngxs/store';
import { AppStateModel, ExtendedPost } from '../interfaces/app';
import { LoadPosts, LoadPosts2 } from './posts.actions';
import { combineLatest, of, Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { tap, catchError, filter, map } from 'rxjs/operators';

@State<AppStateModel>({
  name: 'posts',
  defaults: {
    posts: [],
    currSelected: null
  }
})
export class AppState {
  constructor(private store: Store, private apiService: ApiService) {}

  static getPostsWithFilter(searchString: string) {
    return createSelector(
      [AppState],
      (state: AppStateModel) => {
        // console.log(state.posts);
        return state.posts.filter(
          post =>
            post.title.toLowerCase().indexOf(searchString.toLowerCase()) !== -1 ||
            String(post.id).indexOf(searchString.toLowerCase()) !== -1 ||
            post.userData.name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1 ||
            post.userData.username.toLowerCase().indexOf(searchString.toLowerCase()) !==
              -1
        );
      }
    );
  }

  @Selector()
  static getPosts(state: AppStateModel) {
    return state.posts;
  }

  @Selector()
  static getFilteredPosts(state: AppStateModel) {
    return filterStr => {
      of(state.posts).pipe(
        map(posts =>
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
    };
  }

  @Action(LoadPosts2)
  loadPosts2(ctx: StateContext<AppStateModel>) {
    return this.apiService.postsWithUsers$.pipe(
      tap((posts: ExtendedPost[]) => {
        ctx.patchState({ posts });
      })
    );
  }

  @Action(LoadPosts)
  loadPosts({ patchState, getState }: StateContext<AppStateModel>, action: LoadPosts) {
    const state = getState();
    console.log('doing');

    return this.apiService.filteredPosts$.pipe(
      tap(data => console.log(data)),
      filter(post => !!post),
      tap(data => console.log(data)),
      map(posts =>
        patchState({
          posts: posts
        })
      ),
      catchError(error => {
        console.log(error);
        return of(null);
      })
    );
  }
}
