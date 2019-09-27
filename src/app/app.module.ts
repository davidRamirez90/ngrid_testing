import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PostsComponent } from './components/posts/posts.component';
import { PostComponent } from './components/post/post.component';
import { HttpClientModule } from '@angular/common/http';
import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridMaterialModule } from '@pebula/ngrid-material';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridOverlayPanelModule } from '@pebula/ngrid/overlay-panel';
import { PblNgridMatSortModule } from '@pebula/ngrid-material/sort';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

import { NGXS_PLUGINS, NgxsModule } from '@ngxs/store';

import { MATERIAL } from './material-imports';
import { AppState } from './store/posts.state';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';

@NgModule({
  declarations: [AppComponent, HomeComponent, PostsComponent, PostComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PblNgridModule,
    PblNgridMaterialModule,
    PblNgridBlockUiModule,
    PblNgridOverlayPanelModule,
    MATERIAL,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    PblNgridMatSortModule,
    PblNgridTargetEventsModule,
    NgxsModule.forRoot([AppState], { developmentMode: true }),
    NgxsReduxDevtoolsPluginModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
