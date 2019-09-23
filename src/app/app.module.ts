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
import { TableTemplateComponent } from './components/table-template/table-template.component';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridOverlayPanelModule } from '@pebula/ngrid/overlay-panel';
import { PblNgridMatSortModule } from '@pebula/ngrid-material/sort';

import { MATERIAL } from './material-imports';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PostsComponent,
    PostComponent,
    TableTemplateComponent
  ],
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
    PblNgridMatSortModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
