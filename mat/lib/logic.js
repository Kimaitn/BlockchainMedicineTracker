'use strict';

/**
 * Takes in an array of items to be placed on the blockchain for the
 * @param {org.mat.BulkLoad} bulkLoad - The array of items
 * @transaction
 */
async function Parser(bulkLoad){
    const addResources = await getAssetRegistry('org.mat.Item');
    const resources = [];
    const factory = getFactory();

    for(var i = 0; i< bulkLoad.items.length; i++){
        const itemALL = factory.newResource('org.mat', 'Item', bulkLoad.items[i].itemId);
        itemALL.itemTypeUoM = bulkLoad.items[i].itemTypeUoM;
        itemALL.amountOfMedication = bulkLoad.items[i].amountOfMedication;
        itemALL.currentOwner = bulkLoad.items[i].currentOwner;
        itemALL.itemType = bulkLoad.items[i].itemType;
        resources.push(itemALL);
    }
    await addResources.addAll(resources);
}

/**
 * Private function that changes the status of a contract to 'WAITING_CONFIRMATION'
 * @param {org.mat.contract} contract - contract whose status is to be changed
 */
function changeContractStatuses(contract) {
    contract.status = 'WAITING_CONFIRMATION';
    contract.approvalStatusBuyingBusiness = 'WAITING_CONFIRMATION';
    contract.approvalStatusSellingBusiness = 'WAITING_CONFIRMATION';
}

/**
 * Changes owners of a particular item
 * @param {org.mat.UpdateItemOwner} updateItemOwner - the itemTransaction to be updated
 * @transaction
 */
async function updateItemOwner(updateItemOwner) {
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
async function updateShipmentCarrier(updateShipment) {
    updateShipment.contract.shipments[updateShipment.shipmentIndex].carryingBusiness = updateShipment.newCarryingBusiness;
    updateShipment.contract.shipments[updateShipment.shipmentIndex].status = updateShipment.newStatus;
    changeContractStatuses(updateShipment.contract);
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
async function updateItemRequest(updateItemRequest) {
    updateItemRequest.contract.requestedItems[updateItemRequest.itemRequestIndex].unitPrice = updateItemRequest.newUnitPrice;
    updateItemRequest.contract.requestedItems[updateItemRequest.itemRequestIndex].quantity = updateItemRequest.newQuantity;
    changeContractStatuses(updateItemRequest.contract);
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
async function approveContractChanges(approveContractChanges) {
    if(approveContractChanges.contract.sellingBusiness.employees.indexOf(approveContractChanges.acceptingEmployee) >= 0) {
        approveContractChanges.contract.approvalStatusSellingBusiness = 'CONFIRMED';
    }
    else if(approveContractChanges.contract.buyingBusiness.employees.indexOf(approveContractChanges.acceptingEmployee) >= 0) {
        approveContractChanges.contract.approvalStatusBuyingBusiness = 'CONFIRMED';
    }
    if(approveContractChanges.contract.approvalStatusBuyingBusiness === 'CONFIRMED' &&
        approveContractChanges.contract.approvalStatusBuyingBusiness === 'CONFIRMED'
    )
    {
        approveContractChanges.contract.status = 'CONFIRMED';
    }
    return getAssetRegistry('org.mat.Contract')
        .then(function (assetRegistry) {
            return assetRegistry.update(approveContractChanges.contract);
        });
}

/**
 * Confirms a contract's changes
 * @param {org.mat.CompleteContract} completeContract - the contractTransaction to be approved
 * @transaction
 */
function completeContract(completeContract) {
    if(completeContract.contract.approvalStatusSellingBusiness ===
        completeContract.contract.approvalStatusSellingBusiness ===
        'CONFIRMED')
    {
        return;
    }
    if(completeContract.contract.shipments.every((shipment) => {
        return shipment.status === 'ARRIVED';
    }))
    {
        completeContract.contract.status = 'COMPLETED';
    }
    else {
        return;
    }
    return getAssetRegistry('org.mat.Contract')
        .then(function (assetRegistry) {
            return assetRegistry.update(completeContract.contract);
        });
}

/**
 * Updates the absolute arrival time of shipments specified within a contract
 * This will need approval from all participants of the contract
 * @param {org.mat.UpdateContractArrivalDateTime} updateContractArrivalDateTime - the contractTransaction to be updated
 * @transaction
 */
async function updateContractArrivalDateTime(updateContractArrivalDateTime) {
    updateContractArrivalDateTime.contract.arrivalDateTime = updateContractArrivalDateTime.newArrivalDateTime;
    changeContractStatuses(updateContractArrivalDateTime.contract);
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
async function addShipmentToShipmentList(addShipmentToShipmentList) {
    addShipmentToShipmentList.contract.shipmentList.addAll([addShipmentToShipmentList.newShipment]);
    return getAssetRegistry('org.mat.Contract')
        .then(function (assetRegistry) {
            return assetRegistry.update(addShipmentToShipmentList.contract);
        });
}

/**
 * Removes a shipment from a shipmentList in a contract
 * @param {org.mat.RemoveShipmentFromShipmentList} removeShipmentFromShipmentList - the contractTransaction to be updated
 * @transaction
 */
async function removeShipmentFromShipmentList(removeShipmentFromShipmentList) {
    removeShipmentFromShipmentList.contract.shipments.splice(
        removeShipmentFromShipmentList.shipmentIndex,
        1
    );
    return getAssetRegistry('org.mat.Contract')
        .then(function (assetRegistry) {
            return assetRegistry.update(removeShipmentFromShipmentList.contract);
        });
}

/**
 * Adds an itemRequest to a contract
 * @param {org.mat.AddItemRequestToRequestedItemsList} addItemRequestToRequestedItemsList - the contractTransaction to be updated
 * @transaction
 */
async function addItemRequestToRequestedItemsList(addItemRequestToRequestedItemsList) {
    addItemRequestToRequestedItemsList.contract.requestedItems = addItemRequestToRequestedItemsList.newItemRequest;
    return getAssetRegistry('org.mat.Contract')
        .then(function (assetRegistry) {
            return assetRegistry.update(addItemRequestToRequestedItemsList.contract);
        });
}

/**
 * Removes an itemRequest from a contract
 * @param {org.mat.RemoveItemRequestFromRequestedItemsList} removeItemRequestFromRequestedItemsList - the contractTransaction to be updated
 * @transaction
 */
async function removeItemRequestFromRequestedItemsList(removeItemRequestFromRequestedItemsList) {
    removeItemRequestFromRequestedItemsList.contract.requestedItems.splice(
        removeItemRequestFromRequestedItemsList.itemRequestIndex,
        1
    );
    return getAssetRegistry('org.mat.Contract')
        .then(function (assetRegistry) {
            return assetRegistry.update(removeItemRequestFromRequestedItemsList.contract);
        });
}

/**
 * Updates a user's email
 * @param {org.mat.UpdateUserEmail} updateUserEmail - the userTransaction to be changed
 * @transaction
 */
async function updateUserEmail(updateUserEmail) {
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
async function updateUserPassword(updateUserPassword) {
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
async function updateBusinessInfo(updateBusinessInfo) {
    updateBusinessInfo.business.name = updateBusinessInfo.newBusinessName;
    if(updateBusinessInfo.hasOwnProperty('newPoCName')) {
        updateBusinessInfo.business.PoCName = updateBusinessInfo.newPoCName;
    }
    if(updateBusinessInfo.hasOwnProperty('newPoCEmail')) {
        updateBusinessInfo.business.PoCEmail = updateBusinessInfo.newPoCEmail;
    }
    if(updateBusinessInfo.hasOwnProperty('newAddress')) {
        updateBusinessInfo.business.address = updateBusinessInfo.newAddress;
    }
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
async function updateBusinessAccBalance(updateBusinessAccBalance) {
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
async function removeItemFromInventory(removeItemFromInventory) {
    var index = removeItemFromInventory.business.inventory.indexOf(removeItemFromInventory.removeItem);
    if(index>-1) {
        removeItemFromInventory.business.inventory.splice(index, 1);
    }
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
async function addItemToInventory(addItemToInventory) {
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
async function removeEmployeeFromBusiness(removeEmployeeFromBusiness) {
    var index = removeEmployeeFromBusiness.business.employees.indexOf(removeEmployeeFromBusiness.removeEmployee);
    if(index>-1) {
        removeEmployeeFromBusiness.business.employees.splice(index, 1);
    }
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
async function addEmployeeToBusiness(addEmployeeToBusiness) {
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
async function updateEmployeeInfo(updateEmployeeInfo) {
    updateEmployeeInfo.employee.firstName = updateEmployeeInfo.employee.newFirstName;
    updateEmployeeInfo.employee.lastName = updateEmployeeInfo.employee.newLastName;
    updateEmployeeInfo.employee.email = updateEmployeeInfo.employee.newEmail;
    if(updateEmployeeInfo.hasOwnProperty('newPhoneNumber')) {
        updateEmployeeInfo.employee.phoneNumber = updateEmployeeInfo.employee.newPhoneNumber;
    }
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
async function updateEmployeeType(updateEmployeeType) {
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

    // create employee for manufacturer
    const memployee = factory.newResource(org, 'Employee', 'B001_E001');
    memployee.firstName = 'Bob';
    memployee.lastName = 'Ross';
    memployee.email = 'BobRoss@gmail.com';
    memployee.employeeType = 'Admin';
    memployee.phoneNumber = '407-999-9999';
    memployee.worksFor = factory.newRelationship(org, 'Business', 'B001');

    manufacturer.employees = [memployee];

    // create user for manufacturer employee
    const muser = factory.newResource(org, 'User', 'BobRoss@gmail.com');
    muser.password = 'BobRoss';
    muser.employeeId = memployee.employeeId;

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

    // create employee for carrier
    const cemployee = factory.newResource(org, 'Employee', 'B002_E001');
    cemployee.firstName = 'Bob';
    cemployee.lastName = 'Loss';
    cemployee.email = 'BobLoss@gmail.com';
    cemployee.employeeType = 'Admin';
    cemployee.phoneNumber = '407-999-9991';
    cemployee.worksFor = factory.newRelationship(org, 'Business', 'B002');

    carrier.employees = [cemployee];

    // create user for carrier employee
    const cuser = factory.newResource(org, 'User', 'BobLoss@gmail.com');
    cuser.password = 'BobLoss';
    cuser.employeeId = cemployee.employeeId;

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

    // create employee for distributor
    const demployee = factory.newResource(org, 'Employee', 'B003_E001');
    demployee.firstName = 'Bob';
    demployee.lastName = 'DDoss';
    demployee.email = 'BobDDoss@gmail.com';
    demployee.employeeType = 'Admin';
    demployee.phoneNumber = '407-999-9992';
    demployee.worksFor = factory.newRelationship(org, 'Business', 'B003');

    // create user for distributor employee
    const duser = factory.newResource(org, 'User', 'BobDDoss@gmail.com');
    duser.password = 'BobDDoss';
    duser.employeeId = demployee.employeeId;

    // create regular employee for distributor
    const demployee2 = factory.newResource(org, 'Employee', 'B003_E002');
    demployee2.firstName = 'Bob';
    demployee2.lastName = 'Zoss';
    demployee2.email = 'BobZoss@gmail.com';
    demployee2.employeeType = 'Regular';
    demployee2.phoneNumber = '407-999-9993';
    demployee2.worksFor = factory.newRelationship(org, 'Business', 'B003');

    distributor.employees = [demployee, demployee2];

    // create user for distributor employee
    const duser2 = factory.newResource(org, 'User', 'BobZoss@gmail.com');
    duser2.password = 'BobZoss';
    duser2.employeeId = demployee2.employeeId;

    // create itemType
    const itemType = factory.newResource(org, 'ItemType', 'Adderall');

    // create item
    const item = factory.newResource(org, 'Item', 'I00001');
    item.itemTypeUoM = 'g';
    item.amountOfMedication = 400;
    item.currentOwner = factory.newRelationship(org, 'Business', 'B001');
    item.itemType = factory.newRelationship(org, 'ItemType', 'Adderall');

    // create the contract
    const contract = factory.newResource(org, 'Contract', 'C001');
    contract.approvalStatusBuyingBusiness = 'CONFIRMED';
    contract.approvalStatusSellingBusiness = 'CONFIRMED';
    contract.status = 'CONFIRMED';
    const tomorrow = setupDemo.timestamp;
    tomorrow.setDate(tomorrow.getDate() + 1);
    contract.arrivalDateTime = tomorrow; // the shipment has to arrive tomorrow
    contract.sellingBusiness = factory.newRelationship(org, 'Business', 'B001');
    contract.buyingBusiness = factory.newRelationship(org, 'Business', 'B003');

    // create the itemRequest concept
    const itemRequest = factory.newConcept(org, 'ItemRequest', 'R001');
    itemRequest.requestedItem = factory.newRelationship(org, 'ItemType', 'Adderall');
    itemRequest.unitPrice = 14.2;
    itemRequest.quantity = 2;

    contract.requestedItems = [itemRequest];

    // create the shipment concept
    const shipment = factory.newConcept(org, 'Shipment', 'S001');
    shipment.status = 'IN_TRANSIT';
    shipment.destinationAddress = dAddress;
    shipment.sourceAddress = mAddress;
    shipment.carryingBusiness = factory.newRelationship(org, 'Business', 'B002');
    shipment.items = [factory.newRelationship(org, 'Item', 'I00001')];

    contract.shipments = [shipment];

    // add the manufacturer
    const manufacturerRegistry = await getAssetRegistry(org + '.Business');
    await manufacturerRegistry.addAll([manufacturer]);

    // add the memployee
    const memployeeRegistry = await getParticipantRegistry(org + '.Employee');
    await memployeeRegistry.addAll([memployee]);

    // add the memployee user
    const muserRegistry = await getAssetRegistry(org + '.User');
    await muserRegistry.addAll([muser]);

    // add the carrier
    const carrierRegistry = await getAssetRegistry(org + '.Business');
    await carrierRegistry.addAll([carrier]);

    // add the cemployee
    const cemployeeRegistry = await getParticipantRegistry(org + '.Employee');
    await cemployeeRegistry.addAll([cemployee]);

    // add the cemployee user
    const cuserRegistry = await getAssetRegistry(org + '.User');
    await cuserRegistry.addAll([cuser]);

    // add the distributor
    const distributorRegistry = await getAssetRegistry(org + '.Business');
    await distributorRegistry.addAll([distributor]);

    // add the demployee
    const demployeeRegistry = await getParticipantRegistry(org + '.Employee');
    await demployeeRegistry.addAll([demployee]);

    // add the cemployee user
    const duserRegistry = await getAssetRegistry(org + '.User');
    await duserRegistry.addAll([duser]);

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
