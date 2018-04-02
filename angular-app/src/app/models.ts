export class Address {
	city: string;
	country: string;
	street: string;
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
	itemTypeUoM: UoM;
	amountOfMedication: number;
	currentOwner: string;
	itemType: ItemType;
}

export class Shipment {
	shipmentId: string;
	status: Status;
	currentOwner: string;
	destination: Address;
	source: Address;
	contract: string;
	items: string[];
}

export class ItemRequest {
	itemRequestId: string;
	item: string;
	unitPrice: number;
	quantity: number;
}

export class Contract {
	contractId: string;
	status: Status;
	requestItems: string[];
	sellingBusiness: string;
	buyBusiness: string;
	shipments: string[];
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
	businessType: BusinessType;
	pocName: string;
	pocEmail: string;
	address: Address;
	accountBalance: number;
	inventory: string[];
	employees: string[];
}

export class Employee {
	employeeId: string;
	firstName: string;
	lastName: string;
	email: string;
	employeeType: EmployeeType;
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

