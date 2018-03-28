import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';


import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login.component';
import { TrackComponent } from './track.component';
import { DashboardComponent } from './dashboard.component';
import { Configuration }     from './configuration';
import { DataService }     from './data.service';
import {routing} from './app.routing';

@NgModule({
  declarations: [
    AppComponent, 
	HomeComponent, 
	LoginComponent, 
	TrackComponent, 
	DashboardComponent
  ],
  imports: [
    BrowserModule, 
	FormsModule,
	ReactiveFormsModule,	
	HttpModule,
	routing
  ],
  providers: [
	Configuration,
	DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
