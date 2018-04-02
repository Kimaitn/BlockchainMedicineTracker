import { Component, AfterViewInit } from '@angular/core';
import { LoginService } from './Login.service';
import 'rxjs/add/operator/toPromise';
import { Contract } from './models';
	
@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: './track.component.html',
  styleUrls: ['./css/bootstrap.min.css',
  './css/style.css',
  './css/jqueryui1.css',
  './css/jqueryui2.css',
  './css/fontawesome.css'],
  providers: [LoginService]
})

export class TrackComponent implements AfterViewInit  {
	showMedicine: boolean;
    medicine: string;
	medamount: number;
	medname: string;
	UoM: string;
	private allItems;
	private allContracts;
	private errorMessage;
	//contracts: Array<Contract>;
	contracts;
	contractlen: number;
	
	constructor(private serviceLogin:LoginService){
	  this.showMedicine = false;
	  this.contracts = new Array();
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
		this.loadAll(medicine);
	}
	
	loadAll(medicine): Promise<any>  {
    
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

			if(item.itemId==medicine){

				this.medname = item.itemType;
				this.medamount = item.amountOfMedication;
				this.UoM = item.itemTypeUoM;
				//this.loadContracts(medicine);
				//todo remove old data from table
				this.showMedicine = true;
				break;
			}
		  }

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
	  
	  loadContracts(medicine): Promise<any>  {
    
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
			//console.log("in for loop")
			//console.log("asd: "+contract);
			//console.log(contract);
			//console.log(contract.ItemType.itemTypeMedId);
			//console.log(medicine);
			if(contract.ItemType.itemTypeMedId==medicine){
				//console.log("here")
				if(contract.sellingBusiness.BusinessType == "Carrier")
					contract.icon = "truck";
				else
					contract.icon = "flask";
				this.contracts.push(contract);
				//console.log("asd");
				//console.log(contract);
				//console.log(this.contracts);
				//break;
			}
		  }
		  //console.log(contracts);
		  this.allContracts = contractsList;
		  this.contractlen = 12/this.contracts.length; //will need to fix
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