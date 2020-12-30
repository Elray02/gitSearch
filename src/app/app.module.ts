import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TuiRootModule } from '@taiga-ui/core';
import { HomePageComponent } from './components/homePage/homePage.component';

@NgModule({
  declarations: [AppComponent, HomePageComponent],
  imports: [BrowserModule, TuiRootModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
