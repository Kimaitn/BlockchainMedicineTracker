import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./css/bootstrap.min.css',
  './css/style.css',
  './css/jqueryui1.css',
  './css/jqueryui2.css',
  './css/fontawesome.css',
  './css/aos.css']
})
export class HomeComponent implements OnInit  {
    header_title: string;

    constructor(){
      this.header_title = "This is a home page!"
    }
	ngOnInit() {
		
		var height = window.innerHeight-130-100;
		//$('.fullsize').height(height+"px");
		var fullsize = document.getElementsByClassName("fullsize");
		for(var i = 0; i<fullsize.length; i++){
			(<HTMLElement>fullsize[i]).style.height = height+"px";
		}
		
		var bheight = height/2 - document.getElementById("bannertext").clientHeight/2;
		document.getElementById("bannertext").style.marginTop =  bheight+"px";
		
		//var boxes = $('#holdboxes div div');
		var boxes = document.getElementsByClassName("subboxes");
		var maxheight = 0;
		for(var i = 0; i<boxes.length; i++){
			//maxheight = $(boxes[i]).height()>maxheight?$(boxes[i]).height():maxheight;
			maxheight = boxes[i].clientHeight>maxheight?boxes[i].clientHeight:maxheight;
		}
		maxheight += 40;
		//$('#holdboxes div div').height(maxheight+"px");
		for(var i = 0; i<boxes.length; i++){
			//maxheight = $(boxes[i]).height()>maxheight?$(boxes[i]).height():maxheight;
			(<HTMLElement>boxes[i]).style.height = maxheight+"px";
		}
	}
 }