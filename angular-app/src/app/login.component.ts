import { Component, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Md5 } from 'ts-md5/dist/md5';
import { LoginService } from './Login.service';
import { Router } from "@angular/router";
import 'rxjs/add/operator/toPromise';
//declare var toload.index.init:any;

	
@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: './login.component.html',
  styleUrls: ['./css/bootstrap.min.css',
  './css/style.css',
  './css/jqueryui1.css',
  './css/jqueryui2.css',
  './css/fontawesome.css'],
  providers: [LoginService]
})
export class LoginComponent implements AfterViewInit  {
    signup: boolean;
	myForm: FormGroup;
	id = new FormControl("", Validators.required);
    email = new FormControl("", Validators.required);
    password = new FormControl("", Validators.required);
    type = new FormControl("", Validators.required);
    private allUsers;
	private errorMessage;
	incorrect: boolean;
	
	constructor(private serviceLogin:LoginService, fb: FormBuilder,private router: Router){
		this.signup = false;
		
		this.myForm = fb.group({
         
			id:this.id,
			email:this.email,      
			password:this.password,
			type:this.type
			  
		});
		
		this.incorrect = false;
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
		//this.loadAll();
	}
	
	signIn(){
		
		var inputemail = (<HTMLInputElement>document.getElementById("inputEmail")).value;
		var inputpassword = (<HTMLInputElement>document.getElementById("inputPassword")).value;
		//console.log(inputemail+" "+inputpassword);
		var inputpassword2 = Md5.hashStr(inputpassword);
		//console.log(inputpassword2);
		this.isUser(inputemail, inputpassword2);
		
	}
	
	signUp(){
		

		var inputemail = (<HTMLInputElement>document.getElementById("signupinputEmail")).value;
		var inputpassword = (<HTMLInputElement>document.getElementById("signupinputPassword")).value;
		var inputpasswordR = (<HTMLInputElement>document.getElementById("signupinputRPassword")).value;
		var inputname = (<HTMLInputElement>document.getElementById("signupinputCompany")).value;
		var inputtype = (<HTMLInputElement>document.getElementById("signupinputRole")).value;
		
		
		if(inputpassword == ""){
			(<HTMLInputElement>document.getElementById("signupinputPassword")).style.borderBottomColor = "Red";
			return;
		} else {
			(<HTMLInputElement>document.getElementById("signupinputPassword")).style.borderBottomColor = "";
		}
		if(inputpasswordR == ""){
			(<HTMLInputElement>document.getElementById("signupinputRPassword")).style.borderBottomColor = "Red";
			return;
		} else {
			(<HTMLInputElement>document.getElementById("signupinputRPassword")).style.borderBottomColor = "";
		}
		if(inputname == ""){
			(<HTMLInputElement>document.getElementById("signupinputCompany")).style.borderBottomColor = "Red";
			return;
		} else {
			(<HTMLInputElement>document.getElementById("signupinputCompany")).style.borderBottomColor = "";
		}
		
		if(inputemail.indexOf("@")==-1||inputemail.indexOf(".")==-1||inputemail == ""){
			(<HTMLInputElement>document.getElementById("signupinputEmail")).style.borderBottomColor = "Red";
			return;
		} else {
			(<HTMLInputElement>document.getElementById("signupinputEmail")).style.borderBottomColor = "";
		}
		
		if(inputpasswordR !== inputpassword){
			(<HTMLInputElement>document.getElementById("signupinputPassword")).style.borderBottomColor = "Red";
			(<HTMLInputElement>document.getElementById("signupinputRPassword")).style.borderBottomColor = "Red";
			return;
		} else {
			(<HTMLInputElement>document.getElementById("signupinputPassword")).style.borderBottomColor = "";
			(<HTMLInputElement>document.getElementById("signupinputRPassword")).style.borderBottomColor = "";
		}
		
		
		//console.log(inputemail+" "+inputpassword);
		var inputpassword2 = Md5.hashStr(inputpassword);
		
		var business = new Object();
		business.PoCEmail = inputemail;
		business.PoCPassword = inputpassword2;
		business.name = inputname;
		business.BusinessType = inputtype;
		
		//console.log(business);
		//console.log(inputpassword2);
		//this.isUser(inputemail, inputpassword2);
		this.addBusiness(business);
		this.toggleSignup(false);
		
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
	
	//this was a test
	loadAll(): Promise<any>  {
    
    //retrieve all residents
		let usersList = [];
		return this.serviceLogin.getAllUsers()
		.toPromise()
		.then((result) => {
				this.errorMessage = null;
			  result.forEach(user => {
				usersList.push(user);
			  });     
		})
		.then(() => {

		  for (let user of usersList) {
			//console.log("in for loop")
			//console.log(user.email)
		  }

		  this.allUsers = usersList;
		}).catch((error) => {
			if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if (error == '500 - Internal Server Error') {
			  this.errorMessage = "Input error";
			}
			else{
				this.errorMessage = error;
			}
		});

	  }
	
	addBusiness(business): Promise<any>  {
		return this.serviceLogin.addBusiness(business)
		.toPromise()
		.then((result) => {
				this.errorMessage = null;
		})
		.then(() => {
		}).catch((error) => {
			if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if (error == '500 - Internal Server Error') {
			  this.errorMessage = "Input error";
			}
			else{
				this.errorMessage = error;
			}
		});

	  }
	
	isUser(_email, _password): Promise<any>  {
    
    //retrieve all residents
		let usersList = [];
		return this.serviceLogin.getAllBusinesses()
		.toPromise()
		.then((result) => {
				this.errorMessage = null;
			  result.forEach(user => {
				usersList.push(user);
			  });     
		})
		.then(() => {
			
		  //console.log("Is there a user");
		  var foundany = false;
		  for (let user of usersList) {
			if(user.PoCEmail==_email.toLowerCase()){
				//console.log("FOUND THE SAME USER");
				foundany = true;
				if(user.PoCPassword==_password){
					//console.log("FOUND THE SAME PASSWORD");
					localStorage.setItem('email', user.PoCEmail);
					localStorage.setItem('id', user.businessId);
					localStorage.setItem('name', user.name);
					localStorage.setItem('type', user.BusinessType);
					this.router.navigate(['/dashboard']);
					
					break;
				} else {
					//console.log("Different Password now");
					this.incorrect = true;
				}
			}
		  }
		  if(!foundany)
			this.incorrect = true;

		  this.allUsers = usersList;
		}).catch((error) => {
			if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if (error == '500 - Internal Server Error') {
			  this.errorMessage = "Input error";
			}
			else{
				this.errorMessage = error;
			}
		});

	  }
 }