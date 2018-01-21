import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';


import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login.component';
import { TrackComponent } from './track.component';
import {routing} from './app.routing';

@NgModule({
  declarations: [
    AppComponent, HomeComponent, LoginComponent, TrackComponent
  ],
  imports: [
    BrowserModule, FormsModule, routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
