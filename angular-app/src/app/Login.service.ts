import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs/Observable';
import { Users, Business, Item, Contract } from './models';


import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class LoginService {

	
	private USERS: string = 'users';  
	private BUSINESS: string = 'Business';  
	private ITEM: string = 'Item';  
	private CONTRACT: string = 'Contract';  
	
    constructor(private residentService: DataService<any>) {
    };

    //Users functions
    public getAllUsers(): Observable<Users[]> {
        return this.residentService.getAll(this.USERS);
    }

    public getUser(id: any): Observable<Users> {
      return this.residentService.getSingle(this.USERS, id);
    }

    public addUser(itemToAdd: any): Observable<Users> {
      return this.residentService.add(this.USERS, itemToAdd);
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

    public getBusiness(id: any): Observable<Business> {
      return this.residentService.getSingle(this.BUSINESS, id);
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
	
	//Business functions
    public getAllItems(): Observable<Item[]> {
        return this.residentService.getAll(this.ITEM);
    }

    public getItem(id: any): Observable<Item> {
      return this.residentService.getSingle(this.ITEM, id);
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
	
	// Contract functions
    public getAllContracts(): Observable<Contract[]> {
        return this.residentService.getAll(this.CONTRACT);
    }

    public getContract(id: any): Observable<Contract> {
      return this.residentService.getSingle(this.CONTRACT, id);
    }

    public addContract(itemToAdd: any): Observable<Contract> {
      return this.residentService.add(this.CONTRACT, itemToAdd);
    }

    public deleteContract(id: any): Observable<Contract> {
      return this.residentService.delete(this.CONTRACT, id);
    }

    public updateContract(id: any, itemToUpdate: any): Observable<Contract> {
      return this.residentService.update(this.CONTRACT, id, itemToUpdate);
    }
}