import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs/Observable';
import { Address, Users, Employee, Business, Item, ItemType, Contract, AddItemToInventory,RemoveItemFromInventory,UpdateItemOwner } from './models';


import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class LoginService {

	
	private USERS: string = 'org.mat.User';  
	private BUSINESS: string = 'org.mat.Business';  
	private ITEM: string = 'org.mat.Item';  
	private ITEMTYPE: string = 'org.mat.ItemType';  
  private CONTRACT: string = 'org.mat.Contract';  
  private ADDRESS: string = 'org.mat.Address';  
  private EMPLOYEE: string = 'org.mat.Employee';  
  private ADDITEMTOINVENTORY: string = 'org.mat.AddItemToInventory';  
  private REMOVEITEMFROMINVENTORY: string = 'org.mat.RemoveItemFromInventory';  
	private UPDATEITEMOWNER: string = 'org.mat.UpdateItemOwner';  
	
    constructor(private residentService: DataService<any>) {
    };

    //Users functions
    public getAllUsers(): Observable<Users[]> {
        return this.residentService.getAll(this.USERS);
    }

    public addUser(itemToAdd: any): Observable<Users> {
      return this.residentService.add(this.USERS, itemToAdd);
    }

    public getUser(id: any): Observable<Users[]> {
      return this.residentService.getSingle(this.USERS, id, "userEmail");
    }

    public deleteUser(id: any): Observable<Users> {
      return this.residentService.delete(this.USERS, id);
    }

    public updateUser(id: any, itemToUpdate: any): Observable<Users> {
      return this.residentService.update(this.USERS, id, itemToUpdate);
    }
	
	//Business functions
    public getAllBusinesses(): Observable<Business[]> {
        return this.residentService.getAll(this.BUSINESS);
    }

    public getBusiness(id: any): Observable<Business[]> {
      return this.residentService.getSingle(this.BUSINESS, id, "businessId");
    }

    public addBusiness(itemToAdd: any): Observable<Business> {
      return this.residentService.add(this.BUSINESS, itemToAdd);
    }

    public deleteBusiness(id: any): Observable<Business> {
      return this.residentService.delete(this.BUSINESS, id);
    }

    public updateBusiness(id: any, itemToUpdate: any): Observable<Business> {
      return this.residentService.update(this.BUSINESS, id, itemToUpdate);
    }
	
	//Item functions
    public getAllItems(): Observable<Item[]> {
        return this.residentService.getAll(this.ITEM);
    }

    public getItem(id: any): Observable<Item[]> {
      return this.residentService.getSingle(this.ITEM, id, "currentOwner");
    }

    public addItem(itemToAdd: any): Observable<Item> {
      return this.residentService.add(this.ITEM, itemToAdd);
    }

    public deleteItem(id: any): Observable<Item> {
      return this.residentService.delete(this.ITEM, id);
    }

    public updateItem(id: any, itemToUpdate: any): Observable<Item> {
      return this.residentService.update(this.ITEM, id, itemToUpdate);
    }
	
	//ItemType functions
    public getAllItemTypes(): Observable<ItemType[]> {
        return this.residentService.getAll(this.ITEMTYPE);
    }

    //public getItemType(id: any): Observable<ItemType> {
    //  return this.residentService.getSingle(this.ITEMTYPE, id);
   // }

    public addItemType(itemToAdd: any): Observable<ItemType> {
      return this.residentService.add(this.ITEMTYPE, itemToAdd);
    }

    public deleteItemType(id: any): Observable<ItemType> {
      return this.residentService.delete(this.ITEMTYPE, id);
    }

    public updateItemType(id: any, itemToUpdate: any): Observable<ItemType> {
      return this.residentService.update(this.ITEMTYPE, id, itemToUpdate);
    }
	
	// Contract functions
    public getAllContracts(): Observable<Contract[]> {
        return this.residentService.getAll(this.CONTRACT);
    }

    //public getContract(id: any): Observable<Contract> {
    //  return this.residentService.getSingle(this.CONTRACT, id);
    //}

    public addContract(itemToAdd: any): Observable<Contract> {
      return this.residentService.add(this.CONTRACT, itemToAdd);
    }

    public deleteContract(id: any): Observable<Contract> {
      return this.residentService.delete(this.CONTRACT, id);
    }

    public updateContract(id: any, itemToUpdate: any): Observable<Contract> {
      return this.residentService.update(this.CONTRACT, id, itemToUpdate);
    }

    public addEmployee(itemToAdd: any): Observable<Employee> {
      return this.residentService.add(this.EMPLOYEE, itemToAdd);
    }

    public getEmployee(id: any): Observable<Employee[]> {
      return this.residentService.getSingle(this.EMPLOYEE, id, "employeeId");
    }

    public addItemToInventory(itemToAdd: any): Observable<AddItemToInventory> {
      return this.residentService.add(this.ADDITEMTOINVENTORY, itemToAdd);
    }

    public removeItemFromInventory(itemToAdd: any): Observable<RemoveItemFromInventory> {
      return this.residentService.add(this.REMOVEITEMFROMINVENTORY, itemToAdd);
    }

    public updateItemOwner(itemToAdd: any): Observable<UpdateItemOwner> {
      return this.residentService.add(this.UPDATEITEMOWNER, itemToAdd);
    }
}