import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { AppState } from 'src/app/store/posts.state';
import { Observable } from 'rxjs';
import { ExtendedPost } from 'src/app/interfaces/app';
import { LoadPosts2 } from 'src/app/store/posts.actions';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Select(AppState.getPosts) posts$: Observable<ExtendedPost[]>;

  constructor(private store: Store) {
    this.store
      .dispatch(new LoadPosts2())
      .pipe(tap(console.log))
      .subscribe();
  }

  ngOnInit() {}
}
