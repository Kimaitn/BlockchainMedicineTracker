import { Component, AfterViewInit } from '@angular/core';

	
@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: './track.component.html',
  styleUrls: ['./css/bootstrap.min.css',
  './css/style.css',
  './css/jqueryui1.css',
  './css/jqueryui2.css',
  './css/fontawesome.css']
})

export class TrackComponent implements AfterViewInit  {
	showMedicine: boolean;
    medicine: string;
	
	constructor(){
	  this.showMedicine = false;
    }
	
	ngAfterViewInit() {
		var height = window.innerHeight-130;
		var fullsize = document.getElementsByClassName("fullsize");
		
		for(var i = 0; i<fullsize.length; i++){
			(<HTMLElement>fullsize[i]).style.height = height+"px";
		}
		
		if(this.showMedicine==false){
			var bheight = height/2 - document.getElementById("trackform").clientHeight/2-50;
			document.getElementById("trackform").style.marginTop = bheight+"px";
		}
	}
	
	newTrack(){
		this.showMedicine = false;
		setTimeout(function(){
			var height = window.innerHeight-130;
			var fullsize = document.getElementsByClassName("fullsize");
			
			for(var i = 0; i<fullsize.length; i++){
				(<HTMLElement>fullsize[i]).style.height = height+"px";
			}
			
			var bheight = height/2 - document.getElementById("trackform").clientHeight/2-50;
			document.getElementById("trackform").style.marginTop = bheight+"px";
		}, 0);
	}
	
	submitMedicine(medicine: any){
		//this needs to connect to blockchain
		this.medicine = medicine;
		this.showMedicine = true;
	}
 }