import { Component, AfterViewInit } from '@angular/core';
//declare var toload.index.init:any;

	
@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: './login.component.html',
  styleUrls: ['./css/bootstrap.min.css',
  './css/style.css',
  './css/jqueryui1.css',
  './css/jqueryui2.css',
  './css/fontawesome.css']
})
export class LoginComponent implements AfterViewInit  {
    signup: boolean;
 
    constructor(){
		this.signup = false;
    }
	
	ngAfterViewInit() {
		console.log("herree");
		var height = window.innerHeight-130;
		var fullsize = document.getElementsByClassName("fullsize");
		for(var i = 0; i<fullsize.length; i++){
			(<HTMLElement>fullsize[i]).style.height = height+"px";
		}
		var bheight = (height/2) - (document.getElementById("signin").clientHeight/2);
		document.getElementById("signin").style.marginTop = bheight+"px";
		document.getElementById("signinleft").style.height = document.getElementById("signinform").clientHeight+"px";
	}
	
	toggleSignup(signupq: boolean){
		this.signup = signupq;
		setTimeout(function(){
			if(signupq){
				console.log("here I am");
				var height = window.innerHeight-130;
				var fullsize = document.getElementsByClassName("fullsize");
				for(var i = 0; i<fullsize.length; i++){
					(<HTMLElement>fullsize[i]).style.height = height+"px";
				}
				var bheight = (height/2) - (document.getElementById("signin2").clientHeight/2);
				document.getElementById("signin2").style.marginTop = bheight+"px";
				document.getElementById("signinleft2").style.height = document.getElementById("signinform2").clientHeight+"px";
			} else {
				var height = window.innerHeight-130;
				var fullsize = document.getElementsByClassName("fullsize");
				for(var i = 0; i<fullsize.length; i++){
					(<HTMLElement>fullsize[i]).style.height = height+"px";
				}
				var bheight = (height/2) - (document.getElementById("signin").clientHeight/2);
				document.getElementById("signin").style.marginTop = bheight+"px";
				document.getElementById("signinleft").style.height = document.getElementById("signinform").clientHeight+"px";
			}
		}, 0);
	}
 }