import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule   // ✅ STEP 3 HERE
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
