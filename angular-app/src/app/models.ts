export class Users {
	id: number;
	email: string;
	password: string;
	type: string;
}

export class Business {
	businessId: number;
	PoCEmail: string;
	PoCPassword: string;
	name: string;
	BusinessType: string;
}
export class Item {
	itemId: number;
	packageType: string;
	Business: string;
	ItemType: ItemType;
}

export class ItemType {
	itemTypeId: number;
	itemTypeName: string;
	itemTypeAmount: number; //added this
	itemTypeUoM: string;
	itemTypeMedId: number;
}

export class Contract {
	contractId: string;
	status: string;
	date: string;
	ItemType: ItemType;
	sellingBusiness: Business;
	buyingBusiness: Business;
	unitPrice: number; 
	quantity: number;
	Shipment: string;
}

export class Shipment {
	shipmentId: string;
	status: string;
	sender: Business;
	receiver: Business;
	currentOwner: Business;
	destinationAddress: string;
	sourceAddress: string;
	locations: string;
}
