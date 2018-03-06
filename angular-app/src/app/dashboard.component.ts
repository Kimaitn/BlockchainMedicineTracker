import { Component, AfterViewInit } from '@angular/core';
import { LoginService } from './Login.service';
import 'rxjs/add/operator/toPromise';
import { Contract } from './models';
import { Router } from "@angular/router";
	
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
	allItems;
	private errorMessage;
	contracts;
	items;
	allbusinesses;
	
	constructor(private serviceLogin:LoginService,private router: Router){
	  this.business = localStorage.getItem("name");
	  this.contracts = new Array();
	  this.items = new Array();
	  this.loadContracts(this.business);
	  this.loadItems(this.business);
	  this.loadBusinesses();
    }
	
	ngAfterViewInit() {
	
		document.getElementById("topnav").style.display = "none";

		var height = window.innerHeight-80;
		var fullsize = document.getElementsByClassName("fullsize");
		
		for(var i = 0; i<fullsize.length; i++){
			(<HTMLElement>fullsize[i]).style.height = height+"px";
		}
	}
	
	logout(){
		localStorage.removeItem('email');
		localStorage.removeItem('id');
		localStorage.removeItem('name');
		localStorage.removeItem('type');
		document.getElementById("topnav").style.display = "block";
		this.router.navigate(['/']);
	}
	
	addNewMedicine(){
		var nmtamount = (<HTMLInputElement>document.getElementById("nmtamount")).value;
		var nmpackage = (<HTMLInputElement>document.getElementById("nmpackage")).value;
		var nmtname = (<HTMLInputElement>document.getElementById("nmtname")).value;
		var nmtuom = (<HTMLInputElement>document.getElementById("nmtuom")).value;
		var nmtid = (<HTMLInputElement>document.getElementById("nmtid")).value;
		
		var itemtype = new Object();
		//itemtype.itemTypeId = ""+Math.floor(Math.random()*100000);
		itemtype.itemTypeMedId = ""+parseInt(nmtid);
		itemtype.itemTypeName = nmtname;
		itemtype.itemTypeAmount = ""+parseInt(nmtamount);
		itemtype.itemTypeUoM = nmtuom;
		
		var item = new Object();
		//item.itemId = ""+Math.floor(Math.random()*100000);
		item.packageType = nmpackage;
		item.Business = this.business; // got to fix
		item.ItemType = itemtype;
		
		this.addItemType(itemtype);
		this.addItem(item);
		this.items.push(item);
		//console.log(item);
		
	}

	addNewContract(){
		var sellingbusiness = (<HTMLInputElement>document.getElementById("SellingBusiness")).value;
		var buyingbusiness = (<HTMLInputElement>document.getElementById("BuyingBusiness")).value;
		var itembuy = (<HTMLInputElement>document.getElementById("ItemBuy")).value;
		var unitprice = (<HTMLInputElement>document.getElementById("UnitPrice")).value;
		var quantity = (<HTMLInputElement>document.getElementById("Quantity")).value;
		
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if(dd<10) {
			dd = '0'+dd
		} 

		if(mm<10) {
			mm = '0'+mm
		} 

		today = mm + '/' + dd + '/' + yyyy;
		
		var contract = new Object();
		contract.status = "Pending";
		contract.date = today;
		contract.sellingBusiness = JSON.parse(sellingbusiness);
		contract.buyingBusiness = JSON.parse(buyingbusiness);
		contract.ItemType = JSON.parse(itembuy);
		contract.unitPrice = unitprice;
		contract.quantity = quantity;
		
		//console.log(contract);
		this.addContract(contract);
		this.contracts.push(contract);
	}
	
	loadItems(name): Promise<any>  {
    
    //retrieve all residents
		let itemsList = [];
		return this.serviceLogin.getAllItems()
		.toPromise()
		.then((result) => {
				this.errorMessage = null;
			  result.forEach(item => {
				item.str = JSON.stringify(item);
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
	  
	 loadBusinesses(): Promise<any>  {
    
    //retrieve all residents
		let itemsList = [];
		return this.serviceLogin.getAllBusinesses()
		.toPromise()
		.then((result) => {
				this.errorMessage = null;
			  result.forEach(item => {
				item.str = JSON.stringify(item);
				itemsList.push(item);
			  });     
		})
		.then(() => {
		  this.allbusinesses = itemsList;
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
	  
	addItem(item): Promise<any>  {
		return this.serviceLogin.addItem(item)
		.toPromise()
		.then(() => {
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
	
	addItemType(item): Promise<any>  {
		return this.serviceLogin.addItemType(item)
		.toPromise()
		.then(() => {
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
	
	addContract(item): Promise<any>  {
		return this.serviceLogin.addContract(item)
		.toPromise()
		.then(() => {
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
	
 }