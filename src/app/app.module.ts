import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { BubbleGraphDirective } from './bubble-graph.directive';


@NgModule({
  declarations: [
    AppComponent,
    BubbleGraphDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
