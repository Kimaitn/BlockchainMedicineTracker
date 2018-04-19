export class Address {
	city: string;
	country: string;
	street: string;
	street2: string;
	state: string;
	zip: string;
}

export class Status {
	type: string;
}

export class BusinessType {
	type: string;
}

export class EmployeeType {
	type: string;
}

export class UoM {
	type: string;
}

export class ItemType {
	itemTypeName: string;
}

export class Item {
	itemId: string;
	itemTypeUoM: string;
	amountOfMedication: number;
	currentOwner: string;
	itemType: string;
	str: string;
}

export class Shipment {
	status: Status;
	carryingBusiness: string;
	destination: Address;
	source: Address;
	//contract: string;
	items: string[];
}

export class ItemRequest {
	itemRequestId: string;
	requestedItem: string;
	unitPrice: number;
	quantity: number;
}

export class Contract {
	contractId: string;
	status: string;
	approvalStatusSellingBusiness: string;
	approvalStatusBuyingBusiness: string;
	arrivalDateTime: Date;
	requestedItems: ItemRequest[];
	sellingBusiness: string;
	buyingBusiness: string;
	shipments: string[];
	str: string;
}

export class Users {
	userEmail: string;
	password: string;
	employeeId: string;
}

export class LogInChecker {
	LogInCheckerId: string;
}

export class Business {
	businessId: string;
	name: string;
	businessType: string; //changed to string
	PoCName: string;
	PoCEmail: string;
	address: Address; //replaced with string for now -rather than Address
	accountBalance: number;
	inventory: string[];
	employees: string[];
	str: string;
}

export class Employee {
	employeeId: string;
	firstName: string;
	lastName: string;
	email: string;
	employeeType: string; //changed from EmployeeType
	phoneNumber: string;
	worksFor: string;
}

export class ItemTransaction {
	itemTransactionId: number;
	newOwner: string;
	item: string;
}

export class ShipmentTransaction {
	shipmentTransactionId: number;
	newOwner: string;
	shipment: string;
}

export class AddItemToInventory {
	addItem: string;
	business: string;
	transactionId: string;
}

export class RemoveItemFromInventory {
	removeItem: string;
	business: string;
}

export class UpdateItemOwner {
	newOwner: string;
	item: string;
	newAddress: Address;
	currentOwner: string;
}