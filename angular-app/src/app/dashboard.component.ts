import { Component, AfterViewInit } from '@angular/core';
import { LoginService } from './Login.service';
import 'rxjs/add/operator/toPromise';
import { Contract } from './models';
	
	
@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./css/bootstrap.min.css',
  './css/style.css',
  './css/jqueryui1.css',
  './css/jqueryui2.css',
  './css/fontawesome.css'],
  providers: [LoginService]
})

export class DashboardComponent implements AfterViewInit  {
	medicine: string;
    business: string;
	private allContracts;
	private allItems;
	private errorMessage;
	contracts;
	items;
	
	constructor(private serviceLogin:LoginService){
	  this.business = localStorage.getItem("name");
	  this.contracts = new Array();
	  this.items = new Array();
	  this.loadContracts(this.business);
	  this.loadItems(this.business);
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
	
	loadItems(name): Promise<any>  {
    
    //retrieve all residents
		let itemsList = [];
		return this.serviceLogin.getAllItems()
		.toPromise()
		.then((result) => {
				this.errorMessage = null;
			  result.forEach(item => {
				itemsList.push(item);
			  });     
		})
		.then(() => {

		  for (let item of itemsList) {
			  //console.log(item);
			if(item.Business==name){ //probs gunna have to fix this when actually connecting
				this.items.push(item);
				
			}
		  }
		  //console.log(this.items);
		  this.allItems = itemsList;
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
	
	loadContracts(name): Promise<any>  {
    
    //retrieve all residents
		let contractsList = [];
		return this.serviceLogin.getAllContracts()
		.toPromise()
		.then((result) => {
				this.errorMessage = null;
			  result.forEach(item => {
				contractsList.push(item);
			  });     
		})
		.then(() => {

		  for (let contract of contractsList) {
			if(contract.sellingBusiness.name==name||contract.buyingBusiness.name==name){
				this.contracts.push(contract);
				
			}
		  }
		  //console.log(this.contracts);
		  this.allContracts = contractsList;
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