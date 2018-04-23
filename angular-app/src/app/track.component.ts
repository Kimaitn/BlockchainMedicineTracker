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
	allbusinesses;
	//contracts: Array<Contract>;
	contracts;
	contractlen: number;
	track;
	
	constructor(private serviceLogin:LoginService){
	  this.showMedicine = false;
	  this.contracts = new Array();
	  this.allbusinesses = new Array();
	  this.track = new Array();
	  this.loadBusinesses();
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

	addressToString(object){
		return object.street+", "+object.city+", "+object.state+", "+object.zip+", "+object.country;
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
			  //console.log("WHAT");
			  //console.log(result);
			  //console.log(itemsList)
		})
		.then(() => {

		  for (let item of itemsList) {
			//console.log("in for loop")
			//asd
			//console.log("sup");
			//console.log(item);
			//console.log(item.itemId);
			//console.log(medicine);
			//console.log("asdjioj");
			//console.log(item.itemId==medicine);
			if(item.itemId==medicine){
				//console.log(item.itemId);
				//console.log(item.itemType);
				this.medname = item.itemType;
				this.medamount = item.amountOfMedication;
				this.UoM = item.itemTypeUoM;
				this.loadContracts(medicine);
				//todo remove old data from table

				for(var i = 0; i<item.locations.length; i++){
					for(var y = 0; y<this.allbusinesses.length; y++){
						//console.log("HEREEE");
						//console.log(JSON.stringify(this.allbusinesses[y].address));
						//console.log(JSON.stringify(item.locations[i]));
						if(JSON.stringify(this.allbusinesses[y].address)==JSON.stringify(item.locations[i])){//probs need to fix
							var temp = {'name':'', 'address':'', 'addressstring':''};
							temp.name = this.allbusinesses[y].name;
							temp.address = item.locations[i];
							temp.addressstring = this.addressToString(item.locations[i]);
							this.track.push(temp);
						}
					}
				}

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


	eq(arg1, arg2) {
		if(arg1==arg2)
			return true;
		if(arg1===arg2)
			return true;
		if("resource:"+arg1==arg2)
			return true;
		if(arg1=="resource:"+arg2)
			return true;
		if(arg1.split("#").length>1 && arg1.split("#")[1]==arg2)
			return true;
		if(arg2.split("#").length>1 && arg1==arg2.split("#")[1])
			return true;
		if(encodeURIComponent(arg1)==arg2)
			return true;
		if(arg1==encodeURIComponent(arg2))
			return true;
		if(arg1.split("#").length>1 && encodeURIComponent(arg1.split("#")[1])==arg2)
			return true;
		if(arg2.split("#").length>1 && arg1==encodeURIComponent(arg2.split("#")[1]))
			return true;
		if(arg1.split("#").length>1 && arg1.split("#")[1]==encodeURIComponent(arg2))
			return true;
		if(arg2.split("#").length>1 && encodeURIComponent(arg1)==arg2.split("#")[1])
			return true;
		return false;
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
				//console.log("yes: "+item.name+" "+this.business);
				//if(this.eq(item.businessId,this.currentBusinessId)){ //TO-DO FIX for different businesses
				//	this.currentbusiness = item;
				//	console.log("hizzle");
				//	console.log(this.currentbusiness);
				//}// else {
				itemsList.push(item);
					//currentbusiness.push(item);
				//}
			  });  

			
		})
		.then(() => {
		  this.allbusinesses = itemsList;
		  //this.currentbusiness = itemsList;
		}).catch((error) => {
			if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if (error == '500 - Internal Server Error') {
			  this.errorMessage = "Input error";
			  setTimeout(this.loadBusinesses(), 1000);
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
			//console.log("SJNFDiuHFSDIUH");
			console.log(contract.requestedItems[0].requestedItem.split("#")[1].split("%20").join(" "));
			console.log(medicine);
			if(this.eq(contract.requestedItems[0].requestedItem.split("#")[1].split("%20").join(" "),medicine)){
				console.log("here")
				//if(contract.sellingBusiness.BusinessType == "Carrier")
					contract.icon = "truck";
				//else
				//	contract.icon = "flask";
				if(contract.status=="CONFIRMED")
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