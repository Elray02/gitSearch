import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {
  TuiButtonModule,
  TuiLoaderModule,
  TuiModeModule,
  TuiNotificationsModule,
  TuiRootModule,
} from '@taiga-ui/core';
import { HomePageComponent } from './components/homePage/homePage.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  TuiAvatarModule,
  TuiInputModule,
  TuiIslandModule,
} from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { iconsPathFactory, TUI_ICONS_PATH } from '@taiga-ui/core';
import { AuthInterceptor } from './services/auth.interceptor';
import { TuiAutoFocusModule } from '@taiga-ui/cdk';
import { SearchComponent } from './components/search/search.component';
import { CardProfileComponent } from './components/cardProfile/cardProfile.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    SearchComponent,
    CardProfileComponent,
  ],
  imports: [
    BrowserModule,
    TuiRootModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TuiInputModule,
    TuiIslandModule,
    TuiModeModule,
    TuiButtonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiNotificationsModule,
    TuiLoaderModule,
    TuiAutoFocusModule,
    TuiAvatarModule,
  ],
  providers: [
    {
      provide: TUI_ICONS_PATH,
      useValue: iconsPathFactory('assets/taiga-ui/icons/'),
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
