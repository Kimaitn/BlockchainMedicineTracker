import { Component, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Md5 } from 'ts-md5/dist/md5';
import { LoginService } from './Login.service';
import { Router } from "@angular/router";
import 'rxjs/add/operator/toPromise';
import { Address, Users, Employee, BusinessType, EmployeeType, Business, Item, ItemType, Contract } from './models';

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
		var height = window.innerHeight-130;
		var fullsize = document.getElementsByClassName("fullsize");
		for(var i = 0; i<fullsize.length; i++){
			(<HTMLElement>fullsize[i]).style.height = height+"px";
		}
		var bheight = (height/2) - (document.getElementById("signin").clientHeight/2);
		document.getElementById("signin").style.marginTop = bheight+"px";
		document.getElementById("signinleft").style.height = document.getElementById("signinform").clientHeight+"px";
	}
	
	signIn(){
		
		var inputemail = (<HTMLInputElement>document.getElementById("inputEmail")).value;
		var inputpassword = (<HTMLInputElement>document.getElementById("inputPassword")).value;
		var inputpassword2 = Md5.hashStr(inputpassword);
		this.isUser(inputemail.toLowerCase(), inputpassword2);
		
	}
	
	signUp(){
		
		/* Start SignUp Form Validation Section */
		var inputemail = (<HTMLInputElement>document.getElementById("signupinputEmail")).value;
		var inputpassword = (<HTMLInputElement>document.getElementById("signupinputPassword")).value;
		var inputpasswordR = (<HTMLInputElement>document.getElementById("signupinputRPassword")).value;
		var inputname = (<HTMLInputElement>document.getElementById("signupinputCompany")).value;
		var inputtype = (<HTMLInputElement>document.getElementById("signupinputRole")).value;
		var inputaddressstreet = (<HTMLInputElement>document.getElementById("signupinputAddressStreet")).value;
		var inputaddresscity = (<HTMLInputElement>document.getElementById("signupinputAddressCity")).value;
		var inputaddressstate = (<HTMLInputElement>document.getElementById("signupinputAddressState")).value;
		var inputaddresscountry = (<HTMLInputElement>document.getElementById("signupinputAddressCountry")).value;
		var inputfirstname = (<HTMLInputElement>document.getElementById("signupinputEmployeeFName")).value;
		var inputlastname = (<HTMLInputElement>document.getElementById("signupinputEmployeeLName")).value;
		
		
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
		if(inputname == ""){
			(<HTMLInputElement>document.getElementById("signupinputAddressStreet")).style.borderBottomColor = "Red";
			return;
		} else {
			(<HTMLInputElement>document.getElementById("signupinputAddressStreet")).style.borderBottomColor = "";
		}
		if(inputname == ""){
			(<HTMLInputElement>document.getElementById("signupinputAddressState")).style.borderBottomColor = "Red";
			return;
		} else {
			(<HTMLInputElement>document.getElementById("signupinputAddressState")).style.borderBottomColor = "";
		}
		if(inputname == ""){
			(<HTMLInputElement>document.getElementById("signupinputAddressCity")).style.borderBottomColor = "Red";
			return;
		} else {
			(<HTMLInputElement>document.getElementById("signupinputAddressCity")).style.borderBottomColor = "";
		}
		if(inputname == ""){
			(<HTMLInputElement>document.getElementById("signupinputAddressCountry")).style.borderBottomColor = "Red";
			return;
		} else {
			(<HTMLInputElement>document.getElementById("signupinputAddressCountry")).style.borderBottomColor = "";
		}
		if(inputname == ""){
			(<HTMLInputElement>document.getElementById("signupinputEmployeeFName")).style.borderBottomColor = "Red";
			return;
		} else {
			(<HTMLInputElement>document.getElementById("signupinputEmployeeFName")).style.borderBottomColor = "";
		}
		if(inputname == ""){
			(<HTMLInputElement>document.getElementById("signupinputEmployeeLName")).style.borderBottomColor = "Red";
			return;
		} else {
			(<HTMLInputElement>document.getElementById("signupinputEmployeeLName")).style.borderBottomColor = "";
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
		/* End SignUp Form Validation Section */
		
		
		var inputpassword2 = Md5.hashStr(inputpassword);
		var address: Address;
		address = new Address();
		address.street = inputaddressstreet;
		address.city = inputaddresscity; 
		address.country = inputaddresscountry;
		address.state = inputaddressstate;
		address.zip = ""; //TO-DO ADD THIS
		var addressstr = JSON.stringify(address);
		//this.addAddress(address);

		//var businessType: BusinessType;
		//businessType = new BusinessType();
		//businessType.type = inputtype;
		//var businessTypeStr = JSON.stringify(businessType);

		var business: Business;
		business = new Business();
		business.businessId = inputname+inputaddressstreet;
		business.PoCEmail = inputemail.toLowerCase();
		business.PoCName = inputfirstname+" "+inputlastname;
		business.name = inputname;
		business.businessType = inputtype;
		business.address = address;
		business.accountBalance = 0;
		business.inventory = [];
		business.employees = [];
		this.addBusiness(business);

		//var employeeType: EmployeeType;
		//employeeType = new EmployeeType();
		//employeeType.type = "Admin";
		//var employeeTypeStr = JSON.stringify(employeeType);

		var employee: Employee;
		employee = new Employee();
		employee.employeeId = inputname+"."+inputfirstname+"."+inputlastname+"."+inputemail;
		employee.firstName = inputfirstname;
		employee.lastName = inputlastname;
		employee.email = inputemail.toLowerCase();
		employee.employeeType = "Admin";
		//TO-DO ADD PHONE NUMBER OPTIONAL
		employee.worksFor = "org.mat.Business#"+business.businessId;
		this.addEmployee(employee);
		
		var user: Users;
		user = new Users();
		user.employeeId = inputname+"."+inputfirstname+"."+inputlastname+"."+inputemail;
		user.userEmail = inputemail.toLowerCase();
		user.password = inputpassword2 as string;
		this.addUser(user);

		
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
				console.log("Added Business");
				console.log(result);
		})
		.then(() => {
		}).catch((error) => {
			if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if (error == '500 - Internal Server Error') {
			  this.errorMessage = "Input error";
			  setTimeout(this.addBusiness(business), 1000);
			}
			else{
				this.errorMessage = error;
			}
		});
	}

	addEmployee(employee): Promise<any>  {
		return this.serviceLogin.addEmployee(employee)
		.toPromise()
		.then((result) => {
				this.errorMessage = null;
				console.log("Added Employee");
				console.log(result);
		})
		.then(() => {
		}).catch((error) => {
			if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if (error == '500 - Internal Server Error') {
			  this.errorMessage = "Input error";
			  setTimeout(this.addEmployee(employee), 1000);
			}
			else{
				this.errorMessage = error;
			}
		});
	}

	addUser(user): Promise<any>  {
		return this.serviceLogin.addUser(user)
		.toPromise()
		.then((result) => {
				this.errorMessage = null;
				console.log("Added User");
				console.log(result);
		})
		.then(() => {
		}).catch((error) => {
			if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if (error == '500 - Internal Server Error') {
			  this.errorMessage = "Input error";
			  setTimeout(this.addUser(user), 1000);
			}
			else{
				this.errorMessage = error;
			}
		});
	}
	
	isUser(_email, _password): Promise<any>  {
    
    //retrieve all residents
		let usersList = [];
		return this.serviceLogin.getUser(_email)
		.toPromise()
		.then((result) => {
				this.errorMessage = null;
			 result.forEach(user => {
			 	usersList.push(user);
			  });
			 //console.log(result);
			 //usersList.push(result[0]);     
		})
		.then(() => {
			
		  var foundany = false;
		  for (let user of usersList) {
		  	//console.log(user);
		  	 //console.log(_email.toLowerCase());
		  	 //console.log(user.userEmail);
		  	if(user.userEmail.toLowerCase()==_email.toLowerCase()){
				foundany = true;
				console.log("idk");
				if(user.password==_password){
					console.log("FOUND");
					localStorage.setItem('email', user.userEmail);
					localStorage.setItem('id', user.employeeId);
					//console.log(user);
					//localStorage.setItem('name', user.employeeId.split(".")[0]); //TO-FIX make this less ghetto
					//localStorage.setItem('actualname', user.employeeId.split(".")[1]+" "+user.employeeId.split(".")[2]); //TO-FIX make this less ghetto
					//localStorage.setItem('type', user.BusinessType);
					this.loadInfo(user.employeeId);
					//this.router.navigate(['/dashboard']);
					
					break;
				} else {
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
			  setTimeout(this.isUser(_email, _password), 1000);
			}
			else{
				this.errorMessage = error;
			}
		});

	  }

	  loadInfo(_id): Promise<any>  {
    	let usersList = [];
		return this.serviceLogin.getEmployee(_id)
		.toPromise()
		.then((result) => {
			this.errorMessage = null;
			//result.forEach(user => {
			//	usersList.push(user);
			//});
			usersList.push(result[0]);     
		})
		.then(() => {	
			for (let user of usersList) {
				//console.log("wow");
				//console.log(user);
				localStorage.setItem('employeetype', user.employeeType);
				localStorage.setItem('actualname', user.firstName+" "+user.lastName); //TO-FIX make this less ghetto
				//TO-FIX make this less ghetto
				//console.log(decodeURIComponent(user.worksFor.split("#")[1]));
				this.loadBusinessInfo(decodeURIComponent(user.worksFor.split("#")[1]));
				break;
			}
		}).catch((error) => {
			if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if (error == '500 - Internal Server Error') {
			  this.errorMessage = "Input error";
			  setTimeout(this.loadInfo(_id), 1000);
			}
			else{
				this.errorMessage = error;
			}
		});

	}

	loadBusinessInfo(_id): Promise<any>  {
    	let usersList = [];
		return this.serviceLogin.getBusiness(_id)
		.toPromise()
		.then((result) => {
			this.errorMessage = null;
			//result.forEach(user => {
			//	usersList.push(user);
				usersList.push(result[0]);
				//console.log(result);
			//});     
		})
		.then(() => {	
			for (let user of usersList) {
				//console.log("wow2");
				//console.log(user);
				localStorage.setItem('type', user.businessType);
				localStorage.setItem('businessName', user.name);
				localStorage.setItem('name', user.name);
				localStorage.setItem('businessid', user.businessId);
				//console.log("sup");
				//console.log(user); 
				this.router.navigate(['/dashboard']);
				break;
			}
		}).catch((error) => {
			if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if (error == '500 - Internal Server Error') {
				setTimeout(this.loadBusinessInfo(_id), 1000);
			  this.errorMessage = "Input error";
			}
			else{
				this.errorMessage = error;
			}
		});

	}
 }