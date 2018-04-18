import { Component, AfterViewInit, AfterViewChecked } from '@angular/core';
import { LoginService } from './Login.service';
import 'rxjs/add/operator/toPromise';
//import { Contract } from './models';
import { Router } from "@angular/router";
import { Address, Users, Employee, BusinessType, EmployeeType, Business, Item, ItemRequest, ItemType, Contract, AddItemToInventory, UpdateItemOwner, RemoveItemFromInventory } from './models';
declare var $:any;

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

export class DashboardComponent implements AfterViewInit, AfterViewChecked  {
	medicine: string;
    business: string;
	private allContracts;
	allItems;
	private errorMessage;
	contracts;
	pendingcontracts;
	items;
	itemtypes;
	newcontractitems;
	allbusinesses;
	actualname;
	type: string;
	currentbusiness;
	isManufacturer: boolean;
	onItemsOwned: boolean;
	onContracts: boolean;
	onShipments: boolean;
	onBusiness: boolean;
	currentBusinessId: string;
	
	constructor(private serviceLogin:LoginService,private router: Router){
	  //this.loadInfo(localStorage.getItem('id'));
	  //console.log("now here");
	  this.business = localStorage.getItem("name");
	  this.contracts = new Array();
	  this.actualname = localStorage.getItem("actualname");
	  this.pendingcontracts = new Array();
	  this.items = new Array();
	  this.itemtypes = new Array();
	  this.newcontractitems = new Array();
	  this.type = localStorage.getItem('type');
	  if(this.type=="Manufacturer")
		  this.isManufacturer = true;
	  else
		  this.isManufacturer = false;
	  
	  this.onItemsOwned = true;
	  this.onContracts = false;
	  this.onShipments = false;
	  this.onBusiness = false;
	  this.currentBusinessId = localStorage.getItem("businessid");
	  this.loadBusinesses();
	  this.loadContracts("resource:org.mat.Business#"+encodeURIComponent(localStorage.getItem("businessid")));


	  //this.loadItems(this.currentBusinessId);
	  this.loadItemTypes();
	  
    }
	
	ngAfterViewInit() {
	
		document.getElementById("topnav").style.display = "none";

		var height = window.innerHeight-80;
		var fullsize = document.getElementsByClassName("fullsize");
		
		for(var i = 0; i<fullsize.length; i++){
			(<HTMLElement>fullsize[i]).style.height = height+"px";
		}
	}
	
	ngAfterViewChecked(){
		this.resize();
	}
	
	updateContract(contract, bool){
		contract = JSON.parse(contract);
		if(bool){

			contract.status="CONFIRMED";
			contract.approvalStatusSellingBusiness="CONFIRMED";
			contract.approvalStatusBuyingBusiness="CONFIRMED";
			//console.log("add");
			//contract.status="CONFIRMED";
			//console.log(contract);

			//		console.log("here5");

			for(var y = 0; y<contract.requestedItems.length; y++){
				var possibleitems = new Array();
				var totalhave = 0;
				var quantity = contract.requestedItems[y].quantity;
				var unitprice = contract.requestedItems[y].unitPrice;
				
			//		console.log("here6");
			//		console.log(this.allItems);
				for(var i = 0; i<this.allItems.length; i++){
			//		console.log(this.allItems[i].itemType+" - "+contract.requestedItems[y].requestedItem);
			//		console.log(contract.sellingBusiness+" - "+this.allItems[i].currentOwner);
					if(this.allItems[i].itemType==contract.requestedItems[y].requestedItem&&
						contract.sellingBusiness=="resource:org.mat.Business#"+this.allItems[i].currentOwner){
						totalhave += this.allItems[i].amountOfMedication;
			//			console.log("hizzle");
						possibleitems.push(this.allItems[i]);
					}
				}
			}

			//		console.log("here4");
			//		console.log(possibleitems);
			for (var i = 0; i<possibleitems.length; i++){
				if(quantity<=0){
			//		console.log("here2");
					break;
				}
				if(quantity>possibleitems[i].amountOfMedication){
					quantity -= possibleitems[i].amountOfMedication;
					
					
					var uio = new UpdateItemOwner();
					uio.newOwner = contract.buyingBusiness;
					uio.currentOwner = contract.sellingBusiness;
					uio.item = "org.mat.Item#"+possibleitems[i].itemId;
					//uio.newAddress = JSON.parse(buyingbusiness).address;

					//rifi = new removeItemFromInventory();
					//rifi.removeItem = "org.mat.Item#"+possibleitems[i].itemId;
					//rifi.business = contract.sellingBusiness;
			//		console.log("here");
					this.updateItemOwnerA(uio);
					//removeItemFromInventoryA(rifi);
					
				} else {
			//		console.log("here3");
					possibleitems[i].amountOfMedication -= quantity;
					this.updateItemS(possibleitems[i]);

					var item: Item; 
					item = new Item();
					item.itemId = possibleitems[i].itemId+"-2"; //fill out these fields correctly
					item.itemType = possibleitems[i].itemType;
					item.itemTypeUoM = possibleitems[i].itemTypeUoM;
					item.amountOfMedication = quantity;
					item.currentOwner = contract.buyingBusiness;
					
					var addItemToInv: AddItemToInventory;
					addItemToInv = new AddItemToInventory();
					addItemToInv.addItem = "org.mat.Item#"+encodeURIComponent(item.itemId);
					addItemToInv.business = contract.buyingBusiness;
					//addItemToInv.transactionId = localStorage.getItem("businessid")+"-"+item.itemId;
  					
					quantity = 0;
					this.addItem(item);
					this.addItemToInventory(addItemToInv);
					this.items.push(item);
				}
			}

			this.updateContractS(contract);
		} else {
			//console.log("delete");
			contract.status="CANCELLED";
			this.updateContractS(contract);
		}
		//console.log(contract);
		
		//got to fix
		
		//location.reload();
	}
	
	resize(){
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
	
	loadInfo(_id): Promise<any>  {
    	let usersList = [];
		return this.serviceLogin.getEmployee(_id)
		.toPromise()
		.then((result) => {
			this.errorMessage = null;
			result.forEach(user => {
				usersList.push(user);
			});     
		})
		.then(() => {	
			for (let user of usersList) {
				//console.log("wow");
				//console.log(user);
				localStorage.setItem('employeetype', user.employeeType);
				this.loadBusinessInfo(user.worksFor.split("#")[1]);
				break;
			}
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

	loadBusinessInfo(_id): Promise<any>  {
    	let usersList = [];
		return this.serviceLogin.getBusiness(_id)
		.toPromise()
		.then((result) => {
			this.errorMessage = null;
			result.forEach(user => {
				usersList.push(user);
			});     
		})
		.then(() => {	
			for (let user of usersList) {
				//console.log("wow2");
				//console.log(user);
				localStorage.setItem('type', user.businessType);
				localStorage.setItem('businessName', user.name);
				localStorage.setItem('businessid', user.businessId);
				break;
			}
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

	addNewMedicine(){
		var nmtamount = (<HTMLInputElement>document.getElementById("nmtamount")).value;
		//var nmpackage = (<HTMLInputElement>document.getElementById("nmpackage")).value;
		var nmtname = (<HTMLInputElement>document.getElementById("nmtname")).value;
		var nmtuom = (<HTMLInputElement>document.getElementById("nmtuom")).value;
		var nmtid = (<HTMLInputElement>document.getElementById("nmtid")).value;
		
		var itemtype: ItemType;
		itemtype = new ItemType();
		itemtype.itemTypeName = nmtname;
		
		var itemtypecreated = false;
		for(var i = 0; i<this.itemtypes.length; i++){
			if(itemtype.itemTypeName==this.itemtypes[i].itemTypeName){
				//Items have the same name
				//console.log("same name");
				itemtypecreated = true;
				break;
				//return;
			}
		}
		var item: Item; 
		item = new Item();
		item.itemId = this.business+"-"+nmtid+"-"+nmtname;
		item.itemType = "org.mat.ItemType#"+nmtname;
		item.itemTypeUoM = nmtuom;
		item.amountOfMedication = parseInt(nmtamount);
		item.currentOwner = "org.mat.Business#"+localStorage.getItem("businessid");
		
		var addItemToInv: AddItemToInventory;
		addItemToInv = new AddItemToInventory();
		addItemToInv.addItem = "org.mat.Item#"+encodeURIComponent(item.itemId);
		addItemToInv.business = "org.mat.Business#"+encodeURIComponent(localStorage.getItem("businessid"));
		//addItemToInv.transactionId = localStorage.getItem("businessid")+"-"+item.itemId;

		if(!itemtypecreated){
			this.addItemType(itemtype);
			this.itemtypes.push(itemtype);
		}
		this.addItem(item);
		//console.log(addItemToInv);
		this.addItemToInventory(addItemToInv);
		this.items.push(item);

					$("#myModal").modal("hide");
		//console.log(item);
		
	}

	addNewContract(){
		var sellingbusiness = (<HTMLInputElement>document.getElementById("SellingBusiness")).value;
		var buyingbusiness = (<HTMLInputElement>document.getElementById("BuyingBusiness")).value;
		var itembuy = (<HTMLInputElement>document.getElementById("ItemBuy")).value;
		var unitprice = (<HTMLInputElement>document.getElementById("UnitPrice")).value;
		var quantity = (<HTMLInputElement>document.getElementById("Quantity")).value;
		
		var today = new Date();
		
		console.log(this.allItems);

		var possibleitems = new Array();
		var totalhave = 0;
		for(var i = 0; i<this.allItems.length; i++){
			//console.log("hmm");
			//console.log(this.allItems[i].itemType.split("#")[1].split("%20").join(" "));
			//console.log(itembuy);
			//console.log("org.mat.Business#"+JSON.parse(sellingbusiness).businessId);
			//console.log(this.allItems[i].currentOwner);
			if(this.allItems[i].itemType.split("#")[1].split("%20").join(" ")==itembuy&&
				(JSON.parse(sellingbusiness).businessId)==this.allItems[i].currentOwner){
				totalhave += this.allItems[i].amountOfMedication;
				console.log("WOWOW");
				possibleitems.push(this.allItems[i]);
			}
		}

		if(totalhave<parseInt(quantity)){
			(<HTMLInputElement>document.getElementById("Quantity")).style.borderBottomColor = "Red";
			return;
		} else {
			(<HTMLInputElement>document.getElementById("Quantity")).style.borderBottomColor = "";
		}

		var itemrequests = new Array();
		var itemRequest: ItemRequest;
		itemRequest = new ItemRequest();
		itemRequest.requestedItem = possibleitems[0].itemType; 
		itemRequest.unitPrice = parseFloat(unitprice);
		itemRequest.quantity = parseInt(quantity);	
		itemrequests.push(itemRequest);
		//remItemFromInv = new removeItemFromInventory();
		//remItemFromInv.addItem = "org.mat.Item#"+encodeURIComponent(item.itemId);
		//remItemFromInv.business = "org.mat.Business#"+encodeURIComponent(localStorage.getItem("businessid"));
		//itemRequest.itemRequestId = "Tempaf"; //To-Do Fix (eventually will be removed)

		var contract: Contract;
		contract = new Contract();
		contract.contractId = itembuy+"_"+today;
		contract.status = "WAITING_CONFIRMATION";
		contract.arrivalDateTime = today;
		contract.sellingBusiness = "org.mat.Business#"+JSON.parse(sellingbusiness).businessId;
		contract.buyingBusiness = "org.mat.Business#"+JSON.parse(buyingbusiness).businessId;
		if(JSON.parse(sellingbusiness).businessId==this.currentBusinessId){
			contract.approvalStatusSellingBusiness = "CONFIRMED";
			contract.approvalStatusBuyingBusiness = "WAITING_CONFIRMATION";
		} else if(JSON.parse(buyingbusiness).businessId==this.currentBusinessId){
			contract.approvalStatusBuyingBusiness = "CONFIRMED";
			contract.approvalStatusSellingBusiness = "WAITING_CONFIRMATION";
		} else {
			contract.approvalStatusBuyingBusiness = "WAITING_CONFIRMATION";
			contract.approvalStatusSellingBusiness = "WAITING_CONFIRMATION";
		}
		
		//contract.ItemType = JSON.parse(itembuy);
		//contract.unitPrice = unitprice;
		//contract.quantity = quantity;

		//ItemRequest
		contract.requestedItems = itemrequests;
		
		console.log(contract);

		//eventually
		this.addContract(contract);
		this.contracts.push(contract);
		$("#myModal3").modal("hide");
	}

	loadAllItems(): Promise<any>  {
    
    //retrieve all residents
		let itemsList = [];
		//return this.serviceLogin.getAllItems()
		return this.serviceLogin.getAllItems()
		.toPromise()
		.then((result) => {
				this.errorMessage = null;
				//console.log(result);
			  result.forEach(item => {
				item.str = JSON.stringify(item);
				itemsList.push(item);
				//console.log("weeesnaw");
				//console.log(this.currentbusiness);
				
				for(var i = 0; i<this.currentbusiness.inventory.length; i++){
						//console.log(this.currentbusiness.inventory[i].split("#")[1]);
					if(this.currentbusiness.inventory[i].split("#")[1]==encodeURIComponent(item.itemId)) //probsgunnahavetofix	
						this.items.push(item);	
				}
			  });     
		})
		.then(() => {
		  this.allItems = itemsList;
		  //console.log("here we go");
		  }).catch((error) => {
			if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if (error == '500 - Internal Server Error') {
			  this.errorMessage = "Input error";
			  setTimeout(this.loadAllItems(), 1000);
			}
			else{
				this.errorMessage = error;
			}
		});

	  }
	
	loadItems(name): Promise<any>  {
    
    //retrieve all residents
		let itemsList = [];
		//return this.serviceLogin.getAllItems()
		//console.log("resource:org.mat.Business#"+encodeURIComponent(localStorage.getItem("businessid")));
		return this.serviceLogin.getItem("resource:org.mat.Business#"+encodeURIComponent(localStorage.getItem("businessid")))
		.toPromise()
		.then((result) => {
				this.errorMessage = null;
				//console.log(result);
			  result.forEach(item => {
				item.str = JSON.stringify(item);
				itemsList.push(item);
			  });     
		})
		.then(() => {
		    for (let item of itemsList) {
			//    console.log(item);
			 
			//if(item.Business==name){ //probs gunna have to fix this when actually connecting
				this.items.push(item);
				
			//}
		  }
		  //console.log(this.items);
		  //this.allItems = itemsList;
		  
		  //console.log(this.contracts);
		  //console.log("temp");
		  for(var i = 0; i<this.contracts.length; i++){
				var temp = this.contracts[i].requestedItems[0]; //TO-DO make this work for multiple medicines
				if(this.contracts[i].status=="WAITING_CONFIRMATION")
					continue;
				if(this.contracts[i].status=="CANCELLED")
					continue;

				//console.log("ads");
				//console.log(temp);
				//console.log(this.contracts[i].ItemType);
				//temp.itemTypeAmount = this.contracts[i].quantity;
				var foundmatch = null;
				//console.log("asljdnasod1");
				//console.log(this.items);
				for(var y = 0; y<this.items.length; y++){
					//console.log(this.items[y]);
					//console.log("resource:org.mat.Item#"+encodeURIComponent(this.items[y].itemId)+" "+temp.requestedItem);
					//console.log(temp);
					if("resource:org.mat.Item#"+encodeURIComponent(this.items[y].itemId)==temp.requestedItem){
						foundmatch = this.items[y];
						break;
					}
				}
				console.log("mmoooo : "+foundmatch);
				if(foundmatch==null){
					console.log(this.newcontractitems);
					console.log(this.newcontractitems.length);
					console.log("why");
					for(var y = 0; y<this.newcontractitems.length; y++){ //incase its not in the medicines (but we just added the medicine)
						//console.log(this.newcontractitems[y].id+" "+temp.id);
						console.log("asiudhiuah");
						console.log("resource:org.mat.Item#"+encodeURIComponent(this.newcontractitems[y].itemId));
						console.log(temp.requestedItem);
						if("resource:org.mat.Item#"+encodeURIComponent(this.newcontractitems[y].itemId)==temp.requestedItem){
							foundmatch = this.newcontractitems[y];
							break;
						}
					}
				}
				if(foundmatch!=null){
					//console.log(this.contracts[i].sellingBusiness);
					//console.log("resource:org.mat.Business#"+encodeURIComponent(localStorage.getItem("businessid")));
					var tempamountchange = this.contracts[i].sellingBusiness=="resource:org.mat.Business#"+encodeURIComponent(localStorage.getItem("businessid"))?-1:1;
					foundmatch.amountOfMedication = ""+(parseInt(foundmatch.amountOfMedication)+parseInt(temp.quantity)*tempamountchange);
					
					//console.log("1");
					//console.log(foundmatch);
				} else {
					//old method
					//this.newcontractitems.push(temp);
					for(var y = 0; y<this.allItems.length; y++){
						var tempfound = false;
						if(this.allItems[y].currentOwner==this.contracts[i].sellingBusiness){
							//this.getItem(this.contracts[i].sellingBusiness, temp);
							this.allItems[y].amountOfMedication = this.contracts[i].requestedItems[0].quantity;
							this.newcontractitems.push(this.allItems[y]);
							//console.log("hizzle");
							tempfound = true;
							break;
						}
						if(!tempfound){
							this.getItem(this.contracts[i].sellingBusiness, temp);
						}
					}
				}
		  }
		  //console.log(this.items);
		}).catch((error) => {
			if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if (error == '500 - Internal Server Error') {
			  this.errorMessage = "Input error";
			  setTimeout(this.loadItems(name), 1000);
			}
			else{
				this.errorMessage = error;
			}
		});

	  }

	  getItem(name, contractitem): Promise<any>  {
    
    //retrieve all residents
		let itemsList = [];
		//return this.serviceLogin.getAllItems()
		return this.serviceLogin.getItem(name)
		.toPromise()
		.then((result) => {
				this.errorMessage = null;
			  	//console.log("gee wilikers");
			  	//console.log(result);
			  result.forEach(item => {
				//item.str = JSON.stringify(item);
				itemsList.push(item);
				
			  });     
		})
		.then(() => {
			for (let item of itemsList) {
				//console.log("beep");
				//console.log(contractitem.requestedItem);
				//console.log("resource:org.mat.Item#"+encodeURIComponent(item.itemId));
				if(contractitem.requestedItem == "resource:org.mat.Item#"+encodeURIComponent(item.itemId)){
					item.amountOfMedication = contractitem.quantity;
					this.newcontractitems.push(item);
					break;
				}
			}
		}).catch((error) => {
			if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if (error == '500 - Internal Server Error') {
			  this.errorMessage = "Input error";
			  setTimeout(this.getItem(name, contractitem), 1000);
			}
			else{
				this.errorMessage = error;
			}
		});

	  }
	 loadItemTypes(): Promise<any>  {
    
    //retrieve all residents
		let itemsList = [];
		return this.serviceLogin.getAllItemTypes()
		.toPromise()
		.then((result) => {
				this.errorMessage = null;
			  result.forEach(item => {
				itemsList.push(item);
			  });     
		})
		.then(() => {
		  this.itemtypes = itemsList;
		}).catch((error) => {
			if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if (error == '500 - Internal Server Error') {
			  this.errorMessage = "Input error";
			  setTimeout(this.loadItemTypes(), 1000);
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
				let count = 0;
			  result.forEach(item => {
				item.str = JSON.stringify(item);
				//console.log("yes: "+item.name+" "+this.business);
				if(item.businessId==this.currentBusinessId){ //TO-DO FIX for different businesses
					this.currentbusiness = item;
				//	console.log("hizzle");
				//	console.log(this.currentbusiness);
				}// else {
					itemsList.push(item);
					//currentbusiness.push(item);
				//}
				count++;
			  });  

		  this.loadAllItems();
			
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
			  console.log(result);
		})
		.then(() => {

		  for (let contract of contractsList) {
		  	//console.log(contract.sellingBusiness+" vs "+name);
			if(contract.sellingBusiness==name||contract.buyingBusiness==name){
				if(contract.status=="CANCELLED"){

				} else if(contract.approvalStatusSellingBusiness=="WAITING_CONFIRMATION"&&contract.sellingBusiness==name){
					contract.str = JSON.stringify(contract);
					this.pendingcontracts.push(contract);
				} else if(contract.approvalStatusBuyingBusiness=="WAITING_CONFIRMATION"&&contract.buyingBusiness==name){
					contract.str = JSON.stringify(contract);
					this.pendingcontracts.push(contract);
				} else {
					this.contracts.push(contract);
				}
			}
		  }
		  //console.log(this.contracts);
		  this.allContracts = contractsList;
		  //console.log(contractsList);
		}).catch((error) => {
			if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if (error == '500 - Internal Server Error') {
			  this.errorMessage = "Input error";
			  setTimeout(this.loadContracts(name), 1000);
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
			  setTimeout(this.addItem(item), 1000);
			}
			else{
				this.errorMessage = error;
			}
		});
	}

	addItemToInventory(item): Promise<any>  {
		return this.serviceLogin.addItemToInventory(item)
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
			  setTimeout(this.addItemToInventory(item), 1000);
			}
			else{
				this.errorMessage = error;
			}
		});
	}

	removeItemFromInventoryA(item): Promise<any>  {
		return this.serviceLogin.removeItemFromInventory(item)
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
			  setTimeout(this.removeItemFromInventoryA(item), 1000);
			}
			else{
				this.errorMessage = error;
			}
		});
	}

	updateItemOwnerA(item): Promise<any>  {
		return this.serviceLogin.updateItemOwner(item)
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
			  setTimeout(this.updateItemOwnerA(item), 1000);
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
			  //console.log(error);
			  setTimeout(this.addItemType(item), 1000);
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
			  setTimeout(this.addContract(item), 1000);
			}
			else{
				this.errorMessage = error;
			}
		});
	}
	
	updateContractS(item): Promise<any>  {
		return this.serviceLogin.updateContract(item.contractId, item)
		.toPromise()
		.then(() => {
				this.errorMessage = null;
				location.reload();
		})
		.then(() => {
		}).catch((error) => {
			if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if (error == '500 - Internal Server Error') {
			  this.errorMessage = "Input error";
			  setTimeout(this.updateContractS(item), 1000);
			}
			else{
				this.errorMessage = error;
			}
		});
	}
	updateItemS(item): Promise<any>  {
		return this.serviceLogin.updateItem(item.itemId, item)
		.toPromise()
		.then(() => {
				this.errorMessage = null;
				//location.reload();
		})
		.then(() => {
		}).catch((error) => {
			if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if (error == '500 - Internal Server Error') {
			  this.errorMessage = "Input error";
			  setTimeout(this.updateItemS(item), 1000);
			}
			else{
				this.errorMessage = error;
			}
		});
	}
	
	deleteContract(id): Promise<any>  {
		return this.serviceLogin.deleteContract(id)
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
			  setTimeout(this.deleteContract(id), 1000);
			}
			else{
				this.errorMessage = error;
			}
		});
	}
	
 }