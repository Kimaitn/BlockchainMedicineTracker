import { Component, AfterViewInit } from '@angular/core';

	
@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./css/bootstrap.min.css',
  './css/style.css',
  './css/jqueryui1.css',
  './css/jqueryui2.css',
  './css/fontawesome.css']
})

export class DashboardComponent implements AfterViewInit  {
	medicine: string;
    business: string;
	
	constructor(){
	  this.business = "BusinessName";
    }
	
	ngAfterViewInit() {
	
		document.getElementById("topnav").style.display = "none";

		var height = window.innerHeight-80;
		var fullsize = document.getElementsByClassName("fullsize");
		
		for(var i = 0; i<fullsize.length; i++){
			(<HTMLElement>fullsize[i]).style.height = height+"px";
		}
	}

	addNewMedicineType(){
		var nmtname = (<HTMLInputElement>document.getElementById("nmtname")).value;
		var nmtuom = (<HTMLInputElement>document.getElementById("nmtuom")).value;
		var nmtid = (<HTMLInputElement>document.getElementById("nmtid")).value;
		
		//to-do
		//send call to create new medicine type using above info
	}

	addNewMedicine(){
		var nmtype = (<HTMLInputElement>document.getElementById("nmtype")).value;
		var nmpackage = (<HTMLInputElement>document.getElementById("nmpackage")).value;
		//to-do
		//use nmtype to look up actual id of the type wanted using name?

		//then use that to add the new medicine
	}

	addNewContract(){
	}
	
 }