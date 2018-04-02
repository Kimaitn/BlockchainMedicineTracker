'use strict';

/**
 * Changes owners of a particular item
 * @param {org.mat.UpdateItemOwner} updateItemOwner - the itemTransaction to be updated
 * @transaction
 */
function updateItemOwner(updateItemOwner) {
    updateItemOwner.item.currentOwner = updateItemOwner.newOwner;
    return getAssetRegistry('org.mat.Item')
        .then(function (assetRegistry) {
            return assetRegistry.update(updateItemOwner.item);
        });
}


/**
 * Updates a shipment's carrier
 * This will need approval from all participants of the contract
 * @param {org.mat.UpdateShipment} updateShipment - the shipmentTransaction to be edited
 * @transaction
 */
function updateShipmentCarrier(updateShipment) {
    updateShipment.contract.shipments[shipmentIndex].carryingBusiness = updateShipment.newCarryingBusiness;
    updateShipment.contract.shipments[shipmentIndex].status = updateShipment.newStatus;
    updateShipment.contract.approvalStatus = 'WAITING_CONFIRMATION';
    return getAssetRegistry('org.mat.Contract')
        .then(function (assetRegistry) {
            return assetRegistry.update(updateShipment.contract);
        });
}

/**
 * Changes the quantity or unit price of an item request
 * This will need approval from all participants of the contract
 * @param {org.mat.UpdateItemRequest} updateItemRequest - the itemRequestTransaction to be edited
 * @transaction
 */
function updateItemRequest(updateItemRequest) {
    updateItemRequest.contract.requestedItems[itemRequestIndex].unitPrice = updateItemRequest.newUnitPrice;
    updateItemRequest.contract.requestedItems[itemRequestIndex].quantity = updateItemRequest.newQuantity;
    updateShipment.contract.approvalStatus = 'WAITING_CONFIRMATION';
    return getAssetRegistry('org.mat.Contract')
        .then(function (assetRegistry) {
            return assetRegistry.update(updateItemRequest.contract);
        });
}

/**
 * Confirms a contract's changes
 * @param {org.mat.ApproveContractChanges} approveContractChanges - the contractTransaction to be approved
 * @transaction
 */
function approveContractChanges(approveContractChanges) {
    approveContractChanges.contract.approvalStatus = 'CONFIRMED';
    return getAssetRegistry('org.mat.Contract')
        .then(function (assetRegistry) {
            return assetRegistry.update(approveContractChanges.contract);
        });
}

/**
 * Updates the absolute arrival time of shipments specified within a contract
 * This will need approval from all participants of the contract
 * @param {org.mat.UpdateContractArrivalDateTime} updateContractArrivalDateTime - the contractTransaction to be updated
 * @transaction
 */
function updateContractArrivalDateTime(updateContractArrivalDateTime) {
    updateContractArrivalDateTime.contract.arrivalDateTime = updateContractArrivalDateTime.newArrivalDateTime;
    updateContractArrivalDateTime.contract.status = 'WAITING_CONFIRMATION';
    return getAssetRegistry('org.mat.Contract')
        .then(function (assetRegistry) {
            return assetRegistry.update(updateContractArrivalDateTime.contract);
        });
}

/** 
 * Adds a shipment to a shipmentList in a contract
 * @param {org.mat.AddShipmentToShipmentList} addShipmentToShipmentList - the contractTransaction to be updated
 * @transaction
 */
function addShipmentToShipmentList(addShipmentToShipmentList) {
    addShipmentToShipmentList.contract.shipmentList.addAll([addShipmentToShipmentList.newShipment]);
    return getAssetRegistry('org.mat.Contract')
        .then(function (assetRegistry) {
            return assetRegistry.update(updateContractShipmentList.contract);
        });
}

/** 
 * Removes a shipment from a shipmentList in a contract
 * @param {org.mat.RemoveShipmentFromShipmentList} removeShipmentFromShipmentList - the contractTransaction to be updated
 * @transaction
 */
function removeShipmentToShipmentList(removeShipmentToShipmentList) {
    removeShipmentToShipmentList.contract.shipmentList = 
        removeShipmentToShipmentList.contract.shipmentList.splice(
            removeShipmentToShipmentList.shipmentIndex,
            1
        );
    return getAssetRegistry('org.mat.Contract')
        .then(function (assetRegistry) {
            return assetRegistry.update(updateContractShipmentList.contract);
        });
}

/** 
 * Adds an itemRequest to a contract
 * @param {org.mat.AddItemRequestToRequestedItemsList} addItemRequestToRequestedItemsList - the contractTransaction to be updated
 * @transaction
 */
function addItemRequestToRequestedItemsList(addItemRequestToRequestedItemsList) {
    addItemRequestToRequestedItemsList.contract.requestedItems = addItemRequestToRequestedItemsList.newItemRequest;
    return getAssetRegistry('org.mat.Contract')
        .then(function (assetRegistry) {
            return assetRegistry.update(updateContractShipmentList.contract);
        });
}

/** 
 * Removes an itemRequest from a contract
 * @param {org.mat.RemoveItemRequestFromRequestedItemsList} removeItemRequestFromRequestedItemsList - the contractTransaction to be updated
 * @transaction
 */
function removeItemRequestFromRequestedItemsList(removeItemRequestFromRequestedItemsList) {
    removeItemRequestFromRequestedItemsList.contract.requestedItems = 
        removeItemRequestFromRequestedItemsList.contract.requestedItems.splice(
            removeItemRequestFromRequestedItemsList.itemRequestIndex,
            1
        );
    return getAssetRegistry('org.mat.Contract')
        .then(function (assetRegistry) {
            return assetRegistry.update(updateContractShipmentList.contract);
        });
}

/**
 * Updates a user's email
 * @param {org.mat.UpdateUserEmail} updateUserEmail - the userTransaction to be changed
 * @transaction
 */
function updateUserEmail(updateUserEmail) {
    updateUserEmail.user.userEmail = updateUserEmail.newUserEmail;
    return getAssetRegistry('org.mat.User')
        .then(function (assetRegistry) {
            return assetRegistry.update(updateUserEmail.user);
        });
 }

/** 
 * Update a user's password
 * @param {org.mat.UpdateUserPassword} updateUserPassword - the userTransaction to be processed
 * @transaction
 */
function updateUserPassword(updateUserPassword) {
    updateUserPassword.user.password = updateUserPassword.newUserPass;
    return getAssetRegistry('org.mat.User')
        .then(function (assetRegistry) {
            return assetRegistry.update(updateUserPassword.user);
        });
 }

/** 
 * Updates a business's information
 * @param {org.mat.UpdateBusinessInfo} updateBusinessInfo - the businessTransaction to be processed
 * @transaction
 */
function updateBusinessInfo(updateBusinessInfo) {
    updateBusinessInfo.business.name = updateBusinessInfo.newBusinessName;
    if(updateBusinessInfo.hasOwnProperty(newPoCName))
        updateBusinessInfo.business.PoCName = updateBusinessInfo.newPoCName;
    if(updateBusinessInfo.hasOwnProperty(newPoCEmail))
        updateBusinessInfo.business.PoCEmail = updateBusinessInfo.newPoCEmail;
    if(updateBusinessInfo.hasOwnProperty(newAddress))
        updateBusinessInfo.business.address = updateBusinessInfo.newAddress;
    return getAssetRegistry('org.mat.Business')
        .then(function (assetRegistry) {
            return assetRegistry.update(updateBusinessInfo.business);
        });
 }

/** 
 * Update a business's account balance
 * @param {org.mat.UpdateBusinessAccBalance} updateBusinessAccBalance - the businessTransaction to be processed
 * @transaction
 */
function updateBusinessAccBalance(updateBusinessAccBalance) {
    updateBusinessAccBalance.business.accountBalance = updateBusinessAccBalance.newAccBalance;
    return getAssetRegistry('org.mat.Business')
        .then(function (assetRegistry) {
            return assetRegistry.update(updateBusinessAccBalance.business);
        });
 }

/** 
* Remove an item from the inventory of a business
* @param {org.mat.RemoveItemFromInventory} removeItemFromInventory - the businessTransaction to be processed
* @transaction
*/
function removeItemFromInventory(removeItemFromInventory) {
    var index = removeItemFromInventory.business.inventory.indexOf(removeItemFromInventory.removeItem);
    if(index>-1)
        removeItemFromInventory.business.inventory.splice(index, 1);
    return getAssetRegistry('org.mat.Business')
        .then(function (assetRegistry) {
            return assetRegistry.update(removeItemFromInventory.business);
        });
 }

/** 
 * Adds an item to the inventory of a business
 * @param {org.mat.AddItemToInventory} addItemToInventory - the businessTransaction to be processed
 * @transaction
 */
function addItemToInventory(addItemToInventory) {
    addItemToInventory.business.inventory.push(addItemToInventory.addItem);
    return getAssetRegistry('org.mat.Business')
        .then(function (assetRegistry) {
            return assetRegistry.update(addItemToInventory.business);
        });
 }

/**
 * Removes an employee from a business
 * @param {org.mat.RemoveEmployeeFromBusiness} removeEmployeeFromBusiness - the businessTransaction to be processed
 * @transaction
 */
function removeEmployeeFromBusiness(removeEmployeeFromBusiness) {
    var index = removeEmployeeFromBusiness.business.employees.indexOf(removeEmployeeFromBusiness.removeEmployee);
    if(index>-1)
        removeEmployeeFromBusiness.business.employees.splice(index, 1);
    return getAssetRegistry('org.mat.Business')
        .then(function (assetRegistry) {
            return assetRegistry.update(removeEmployeeFromBusiness.business);
        });
 }

/**
 * Adds an employee to a business
 * @param {org.mat.AddEmployeeToBusiness} addEmployeeToBusiness - the businessTransaction to be processed
 * @transaction
 */
function addEmployeeToBusiness(addEmployeeToBusiness) {
    addEmployeeToBusiness.business.employees.push(addEmployeeToBusiness.addEmployee);
    return getAssetRegistry('org.mat.Business')
        .then(function (assetRegistry) {
            return assetRegistry.update(addEmployeeToBusiness.business);
        });
 }

/** 
* Updates employee's information
* @param {org.mat.UpdateEmployeeInfo} updateEmployeeInfo - the employeeTransaction to be processed
* @transaction
*/
function updateEmployeeInfo(updateEmployeeInfo) {
    updateEmployeeInfo.employee.firstName = updateEmployeeInfo.employee.newFirstName;
    updateEmployeeInfo.employee.lastName = updateEmployeeInfo.employee.newLastName;
    updateEmployeeInfo.employee.email = updateEmployeeInfo.employee.newEmail;
    if(udpateEmployeeInfo.hasOwnProperty(newPhoneNumber))
        updateEmployeeInfo.employee.phoneNumber = updateEmployeeInfo.employee.newPhoneNumber;
    return getParticipantRegistry('org.mat.Employee')
        .then(function (assetRegistry) {
            return assetRegistry.update(updateEmployeeInfo.employee);
        });
 }

/** 
* Updates an employee's type of a business
* @param {org.mat.UpdateEmployeeType} updateEmployeeType - the employeeTransaction to be processed
* @transaction
*/
function updateEmployeeType(updateEmployeeType) {
    updateEmployeeType.employee.employeeType = updateEmployeeType.employee.newEmployeeType;
    return getParticipantRegistry('org.mat.Employee')
        .then(function (assetRegistry) {
            return assetRegistry.update(updateEmployeeType.employee);
        });
 }

/** 
 * Initialize some test assets and participants useful for running a demo.
 * @param {org.mat.SetupDemo} setupDemo - the SetupDemo transaction
 * @transaction
 */
async function setupDemo(setupDemo) {

    const factory = getFactory();
    const org = 'org.mat';

    // create the manufacturer
    const manufacturer = factory.newResource(org, 'Business', 'B001');
    const mAddress = factory.newConcept(org, 'Address');
    manufacturer.name = 'Shire Pharmaceuticals';
    manufacturer.businessType = 'Manufacturer';
    manufacturer.PoCName = 'Bob Ross';
    manufacturer.PoCEmail = 'BobRoss@gmail.com';
    mAddress.city = 'Dublin';
    mAddress.country = 'Ireland';
    mAddress.street = 'Block 2 & 3 Miesian Plaza 50, 50-58 Baggot Street Lower';
    mAddress.zip = 'D02 Y754';
    manufacturer.address = mAddress;
    manufacturer.accountBalance = 23.03;

    // create the carrier
    const carrier = factory.newResource(org, 'Business', 'B002');
    const cAddress = factory.newConcept(org, 'Address');
    carrier.name = 'McKesson';
    carrier.businessType = 'Carrier';
    carrier.PoCName = 'Bob Loss';
    carrier.PoCEmail = 'BobLoss@gmail.com';
    cAddress.street = 'One Post Street';
    cAddress.city = 'San Francisco';
    cAddress.state = 'CA';
    cAddress.country = 'USA';
    cAddress.zip = '94104';
    carrier.address = cAddress;
    carrier.accountBalance = 55.54;

    // create the distributor
    const distributor = factory.newResource(org, 'Business', 'B003');
    const dAddress = factory.newConcept(org, 'Address');
    distributor.name = 'CVS Pharmacy';
    distributor.businessType = 'Distributor';
    distributor.PoCName = 'Bob DDos';
    distributor.PoCEmail = 'BobDDos@gmail.com';
    dAddress.street = 'One CVS Drive';
    dAddress.city = 'Woonsocket';
    dAddress.state = 'RI';
    dAddress.country = 'USA';
    dAddress.zip = '02895';
    distributor.address = dAddress;
    distributor.accountBalance = 645.64;

    // create itemType
    const itemType = factory.newResource(org, 'ItemType', 'Adderall');

    // create item
    const item = factory.newResource(org, 'Item', 'I00001');
    item.itemTypeUoM = 'g';
    item.amountOfMedication = 400;
    item.currentOwner = manufacturer;
    item.itemType = itemType;

    // create the contract
    const contract = factory.newResource(org, 'Contract', 'C001');
    contract.requestedItems = itemRequest;
    contract.status = 'CONFIRMED';
    contract.sellingBusiness = manufacturer;
    contract.buyingBusiness = distributor;
    const tomorrow = setupDemo.timestamp;
    tomorrow.setDate(tomorrow.getDate() + 1);
    contract.arrivalDateTime = tomorrow; // the shipment has to arrive tomorrow

    // create the itemRequest concept
    const itemRequest = factory.newResource(org, 'ItemRequest', 'R001');
    itemRequest.requestedItem = item;
    itemRequest.unitPrice = 14.2;
    itemRequest.quantity = 2;

    contract.itemRequest = [itemRequest];

    // create the shipment concept
    const shipment = factory.newConcept(org, 'Shipment', 'S001');
    shipment.status = 'IN_TRANSIT';
    shipment.destinationAddress = dAddress;
    shipment.sourceAddress = mAddress;
    shipment.currentOwner = manufacturer;
    shipment.carryingBusiness = carrier;
    shipment.items = [item];

    contract.shipments = [shipment];

    // add the manufacturer
    const manufacturerRegistry = await getParticipantRegistry(org + '.Manufacturer');
    await manufacturerRegistry.addAll([manufacturer]);

    // add the carrier
    const carrierRegistry = await getParticipantRegistry(org + '.Carrier');
    await carrierRegistry.addAll([carrier]);

    // add the distributor
    const distributorRegistry = await getParticipantRegistry(org + '.Distributor');
    await distributorRegistry.addAll([distributor]);

    // add the itemType
    const itemTypeRegistry = await getAssetRegistry(org + '.ItemType');
    await itemTypeRegistry.addAll([itemType]);

    // add the item
    const itemRegistry = await getAssetRegistry(org + '.Item');
    await itemRegistry.addAll([item]);

    // add the itemRequest - are now concepts
    //const itemRequestRegistry = await getAssetRegistry(org + '.ItemRequest');
    //await itemRequestRegistry.addAll([itemRequest]);

    // add the shipments - are now concepts
    //const shipmentRegistry = await getAssetRegistry(org + '.Shipment');
    //await shipmentRegistry.addAll([shipment]);

    // add the contracts
    const contractRegistry = await getAssetRegistry(org + '.Contract');
    await contractRegistry.addAll([contract]);
}