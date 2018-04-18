'use strict';

/**
 * Private function that changes the status of a contract to 'WAITING_CONFIRMATION'
 * @param {org.mat.contract} contract - contract whose status is to be changed
 */
function changeContractStatuses(contract) {
    contract.approvalStatusBuyingBusiness = 'WAITING_CONFIRMATION';
    contract.approvalStatusSellingBusiness = 'WAITING_CONFIRMATION';
}

/**
 * Takes in an array of items to be placed on the blockchain for the
 * @param {org.mat.BulkLoad} bulkLoad - The array of items
 * @transaction
 */
async function bulkLoad(bulkLoad){
    const addResources = await getAssetRegistry('org.mat.Item');
    const resources = [];
    const factory = getFactory();

    for(var i = 0; i< bulkLoad.items.length; i++){
        const itemALL = factory.newResource('org.mat', 'Item', bulkLoad.items[i].itemId);
        itemALL.itemTypeUoM = bulkLoad.items[i].itemTypeUoM;
        itemALL.amountOfMedication = bulkLoad.items[i].amountOfMedication;
        itemALL.currentOwner = bulkLoad.items[i].currentOwner;
        itemALL.itemType = bulkLoad.items[i].itemType;
        itemAll.locations = [];
        if(bulkLoad.items[i].locations.length > 0){
            itemALL.locations.push(bulkLoad.items[i].locations);
        }
        else{
            itemALL.locations.push(bulkLoad.addingBusiness.address);
        }
        resources.push(itemALL);
        bulkLoad.addingBusiness.inventory.push(itemALL);
    }
    await addResources.addAll(resources);
    return getAssetRegistry('org.mat.Business')
        .then(function (assetRegistry) {
            return assetRegistry.update(bulkLoad.addingBusiness);
        });
}

/**
 * Changes owners of a particular item
 * @param {org.mat.UpdateItemOwner} updateItemOwner - the itemTransaction to be updated
 * @transaction
 */
async function updateItemOwner(updateItemOwner) {
    const businessRegistry = await getAssetRegistry('org.mat.Business');
    var index = updateItemOwner.currentOwner.inventory.indexOf(updateItemOwner.item);
    if(index>-1) {
        updateItemOwner.currentOwner.inventory.splice(index, 1);
    }
    updateItemOwner.newOwner.inventory.push(updateItemOwner.item);
    await businessRegistry.updateAll([updateItemOwner.currentOwner, updateItemOwner.newOwner]);
    updateItemOwner.item.currentOwner = updateItemOwner.newOwner.businessId;
    if(updateItemOwner.newAddress != undefined){
        updateItemOwner.item.locations.push(updateItemOwner.newAddress);
    }
    else{
        updateItemOwner.item.locations.push(updateItemOwner.newOwner.address);
    }
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
 * Updates a shipment's carrier
 * This will need approval from all participants of the contract
 * @param {org.mat.ApproveShipments} approveShipments - the shipmentTransaction to be edited
 * @transaction
 */
async function approveShipments(approveShipments) {
    approveShipments.shipmentIndexes.forEach((shipmentIndex) => {
        //TODO item changes owner here
        approveShipments.contract.shipments[shipmentIndex].status = 'ARRIVED';
    });
    return getAssetRegistry('org.mat.Contract')
        .then(function (assetRegistry) {
            return assetRegistry.update(approveShipments.contract);
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
    if(approveContractChanges.contract.sellingBusiness.businessId === approveContractChanges.acceptingEmployee.worksFor) {
        approveContractChanges.contract.approvalStatusSellingBusiness = 'CONFIRMED';
    }
    else if(approveContractChanges.contract.buyingBusiness.businessId === approveContractChanges.acceptingEmployee.worksFor) {
        approveContractChanges.contract.approvalStatusBuyingBusiness = 'CONFIRMED';
    }
    if(approveContractChanges.contract.approvalStatusBuyingBusiness === 'CONFIRMED' &&
        approveContractChanges.contract.approvalStatusSellingBusiness === 'CONFIRMED'
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
 * Updates status of contract to be denied if employee of the business buying or selling denys it
 * @param {org.mat.CancelContract} cancelContract - the contractTransaction to be cancelled
 * @transaction
 */
async function cancelContract(cancelContract) {
    if(cancelContract.contract.status === 'CONFIRMED' || cancelContract.contract.status === 'COMPLETED'){
        return;
    }
    else{
        if(cancelContract.contract.sellingBusiness.businessId === cancelContract.denyingEmployee.worksFor) {
            cancelContract.contract.approvalStatusSellingBusiness = 'CANCELLED';
            cancelContract.contract.status = 'CANCELLED';
        }
        else if(cancelContract.contract.sellingBusiness.businessId === cancelContract.denyingEmployee.worksFor) {
            cancelContract.contract.approvalStatusBuyingBusiness = 'CANCELLED';
            cancelContract.contract.status = 'CANCELLED';
        }
        return getAssetRegistry('org.mat.Contract')
            .then(function (assetRegistry) {
                if(cancelContract.contract.approvalStatusBuyingBusiness === 'CANCELLED' &&
                cancelContract.contract.approvalStatusSellingBusiness === 'CANCELLED'
                )
                {
                    return assetRegistry.remove(cancelContract.contract);
                }
                else{
                    return assetRegistry.update(cancelContract.contract);
                }
            });
    }
}

/**
 * Confirms a contract's changes
 * @param {org.mat.CompleteContract} completeContract - the contractTransaction to be approved
 * @transaction
 */
function completeContract(completeContract) {
    const factory = getFactory();
    if(completeContract.contract.approvalStatusBuyingBusiness === 'CONFIRMED' &&
        completeContract.contract.approvalStatusSellingBusiness === 'CONFIRMED'
    )
    {
        if(completeContract.contract.shipments.every((shipment) => {
            return shipment.status === 'ARRIVED';
        }))
        {
            completeContract.contract.status = 'COMPLETED';
            const shipments = completeContract.contract.shipments;
            shipments.forEach(function(shipment){
                var arrayItems = shipment.items;
                arrayItems.forEach(function(items){
                    items.locations.push(shipment.destinationAddress);
                    items.currentOwner = completeContract.contract.buyingBusiness.businessId;
                    getAssetRegistry('org.mat.Item')
                        .then(function (assetRegistry) {
                            return assetRegistry.update(updateItemOwner.item);
                        });
                });
            });
        }
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
    addShipmentToShipmentList.contract.shipments.push(addShipmentToShipmentList.newShipment);
    changeContractStatuses(addShipmentToShipmentList.contract);
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
    changeContractStatuses(removeShipmentFromShipmentList.contract);
    return getAssetRegistry('org.mat.Contract')
        .then(function (assetRegistry) {
            return assetRegistry.update(removeShipmentFromShipmentList.contract);
        });
}

/**
 * Adds an itemRequest to a contract
 * @param {org.mat.AddItemRequestsToRequestedItemsList} addItemRequestsToRequestedItemsList - the contractTransaction to be updated
 * @transaction
 */
async function addItemRequestsToRequestedItemsList(addItemRequestsToRequestedItemsList) {
    addItemRequestsToRequestedItemsList.newItemRequests.forEach((itemRequest) => {
        addItemRequestsToRequestedItemsList.contract.requestedItems.push(itemRequest);
    });
    changeContractStatuses(addItemRequestsToRequestedItemsList.contract);
    return getAssetRegistry('org.mat.Contract')
        .then(function (assetRegistry) {
            return assetRegistry.update(addItemRequestsToRequestedItemsList.contract);
        });
}

/**
 * Removes an itemRequest from a contract
 * @param {org.mat.RemoveItemRequestsFromRequestedItemsList} removeItemRequestsFromRequestedItemsList - the contractTransaction to be updated
 * @transaction
 */
async function removeItemRequestsFromRequestedItemsList(removeItemRequestsFromRequestedItemsList) {
    removeItemRequestsFromRequestedItemsList.itemRequestIndexes.forEach( (itemRequestIndex) => {
        removeItemRequestsFromRequestedItemsList.contract.requestedItems.splice(
            itemRequestIndex,
            1
        );
    });
    changeContractStatuses(removeItemRequestsFromRequestedItemsList.contract);
    return getAssetRegistry('org.mat.Contract')
        .then(function (assetRegistry) {
            return assetRegistry.update(removeItemRequestsFromRequestedItemsList.contract);
        });
}

/**
 * Updates a user's email
 * @param {org.mat.UpdateUserEmail} updateUserEmail - the userTransaction to be changed
 * @transaction
 */
async function updateUserEmail(updateUserEmail) {
    const factory = getFactory();
    const updateUser = factory.newResource('org.mat', 'User', updateUserEmail.newUserEmail);
    updateUser.password = updateUserEmail.user.password;
    updateUser.employeeId = updateUserEmail.user.employeeId;
    const userRegistry = await getAssetRegistry('org.mat.User');
    await userRegistry.remove(updateUserEmail.user);
    await userRegistry.add(updateUser);
    const employeeRegistry = await getParticipantRegistry('org.mat.Employee');
    const employee = await employeeRegistry.get(updateUser.employeeId);
    employee.email = updateUserEmail.newUserEmail;
    await employeeRegistry.update(employee);
    const businessRegistry = await getAssetRegistry('org.mat.Business');
    const business = await businessRegistry.get(employee.worksFor);
    if(business.PoCEmail === updateUserEmail.user.userEmail){
        business.PoCEmail = updateUserEmail.newUserEmail;
        await businessRegistry.update(business);
    }
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
    addItemToInventory.addItem.currentOwner = addItemToInventory.business.businessId;
    getAssetRegistry('org.mat.Item')
        .then(function (assetRegistry) {
            return assetRegistry.update(addItemToInventory.addItem);
        });
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
    getParticipantRegistry('org.mat.Employee')
        .then(function (participantRegistry) {
            return participantRegistry.remove(removeEmployeeFromBusiness.removeEmployee);
        });
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
    addEmployeeToBusiness.addEmployee.worksFor = addEmployeeToBusiness.business.businessId;
    getParticipantRegistry('org.mat.Employee')
        .then(function (participantRegistry) {
            return participantRegistry.update(addEmployeeToBusiness.addEmployee);
        });
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
    const businessRegistry = await getAssetRegistry('org.mat.Business');
    const business = await businessRegistry.get(updateEmployeeInfo.employee.worksFor);
    if(business.PoCName === (updateEmployeeInfo.employee.firstName + ' ' + updateEmployeeInfo.employee.lastName)){
        business.PoCName = (updateEmployeeInfo.newFirstName + ' ' + updateEmployeeInfo.newLastName);
        await businessRegistry.update(business);
    }
    if(business.PoCEmail === updateEmployeeInfo.employee.email){
        business.PoCEmail = updateEmployeeInfo.newEmail;
        await businessRegistry.update(business);
    }
    updateEmployeeInfo.employee.firstName = updateEmployeeInfo.newFirstName;
    updateEmployeeInfo.employee.lastName = updateEmployeeInfo.newLastName;
    updateEmployeeInfo.employee.email = updateEmployeeInfo.newEmail;
    if(updateEmployeeInfo.hasOwnProperty('newPhoneNumber')) {
        updateEmployeeInfo.employee.phoneNumber = updateEmployeeInfo.newPhoneNumber;
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
    updateEmployeeType.employee.employeeType = updateEmployeeType.newEmployeeType;
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
    manufacturer.inventory = [];

    // create employee for manufacturer
    const memployee = factory.newResource(org, 'Employee', 'B001_E001');
    memployee.firstName = 'Bob';
    memployee.lastName = 'Ross';
    memployee.email = 'BobRoss@gmail.com';
    memployee.employeeType = 'Admin';
    memployee.phoneNumber = '407-999-9999';
    memployee.worksFor = manufacturer.businessId;

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
    cemployee.worksFor = carrier.businessId;

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
    distributor.inventory = [];

    // create employee for distributor
    const demployee = factory.newResource(org, 'Employee', 'B003_E001');
    demployee.firstName = 'Bob';
    demployee.lastName = 'DDoss';
    demployee.email = 'BobDDoss@gmail.com';
    demployee.employeeType = 'Admin';
    demployee.phoneNumber = '407-999-9992';
    demployee.worksFor = distributor.businessId;

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
    demployee2.worksFor = distributor.businessId;

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
    item.currentOwner = manufacturer.businessId;
    item.itemType = factory.newRelationship(org, 'ItemType', 'Adderall');
    item.locations = [manufacturer.address];

    // add the item to the manufacturer's inventory
    manufacturer.inventory.push(item);

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

    // add the businesses
    const businessRegistry = await getAssetRegistry(org + '.Business');
    await businessRegistry.addAll([manufacturer, carrier, distributor]);

    // add the employees
    const employeeRegistry = await getParticipantRegistry(org + '.Employee');
    await employeeRegistry.addAll([memployee, cemployee, demployee, demployee2]);

    // add the users
    const userRegistry = await getAssetRegistry(org + '.User');
    await userRegistry.addAll([muser, cuser, duser, duser2]);

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
