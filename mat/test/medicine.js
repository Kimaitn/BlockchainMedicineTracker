/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { BusinessNetworkDefinition, CertificateUtil, IdCard } = require('composer-common');
const path = require('path');

require('chai').should();
let sinon = require('sinon');

const namespace = 'org.mat';
let manufacturer_id = 'BobRoss@gmail.com';
let shipper_id = 'BobDDoss@gmail.com';
let distributor_id = 'BobDDoss@gmail.com';

describe('Medicine Asset Tracking Network', () => {
    // In-memory card store for testing so cards are not persisted to the file system
    const cardStore = require('composer-common').NetworkCardStoreManager.getCardStore( { type: 'composer-wallet-inmemory' } );
    let adminConnection;
    let businessNetworkConnection;
    let factory;
    let clock;

    before(async () => {
        // Embedded connection used for local testing
        const connectionProfile = {
            name: 'embedded',
            'x-type': 'embedded'
        };
        // Generate certificates for use with the embedded connection
        const credentials = CertificateUtil.generate({ commonName: 'admin' });

        // PeerAdmin identity used with the admin connection to deploy business networks
        const deployerMetadata = {
            version: 1,
            userName: 'PeerAdmin',
            roles: [ 'PeerAdmin', 'ChannelAdmin' ]
        };
        const deployerCard = new IdCard(deployerMetadata, connectionProfile);
        const deployerCardName = 'PeerAdmin';
        deployerCard.setCredentials(credentials);

        // setup admin connection
        adminConnection = new AdminConnection({ cardStore: cardStore });
        await adminConnection.importCard(deployerCardName, deployerCard);
        await adminConnection.connect(deployerCardName);

        const adminUserName = 'admin';
        const businessNetworkDefinition = await BusinessNetworkDefinition.fromDirectory(path.resolve(__dirname, '..'));

        businessNetworkConnection = new BusinessNetworkConnection({ cardStore: cardStore });

        // Install the Composer runtime for the new business network
        await adminConnection.install(businessNetworkDefinition);

        // Start the business network and configure an network admin identity
        const startOptions = {
            networkAdmins: [
                {
                    userName: adminUserName,
                    enrollmentSecret: 'adminpw'
                }
            ]
        };
        const adminCards = await adminConnection.start(businessNetworkDefinition.getName(), businessNetworkDefinition.getVersion(), startOptions);

        // Import the network admin identity for us to use
        const adminCardName = `${adminUserName}@${businessNetworkDefinition.getName()}`;
        await adminConnection.importCard(adminCardName, adminCards.get(adminUserName));

        // Connect to the business network using the network admin identity
        await businessNetworkConnection.connect(adminCardName);

        factory = businessNetworkConnection.getBusinessNetwork().getFactory();
        const setupDemo = factory.newTransaction(namespace, 'SetupDemo');
        await businessNetworkConnection.submitTransaction(setupDemo);
    });

    beforeEach(() => {
        clock = sinon.useFakeTimers();
    });

    afterEach(function () {
        clock.restore();
    });

    /******************************************************************************************************/
    /**********************************Logic.js file function tests below**********************************/
    /******************************************************************************************************/

    /* Item change tests */
    describe('#item', () => {

        it('updateItemOwner should change the owner value of the item' , async () => {
            const item_id = 'I00001';
            const business_id = 'B003';

            // create the transaction
            const updateItemOwner = factory.newTransaction(namespace, 'UpdateItemOwner');
            updateItemOwner.item = factory.newRelationship(namespace, 'Item', item_id);
            updateItemOwner.newOwner = factory.newRelationship(namespace, 'Business', business_id);
            await businessNetworkConnection.submitTransaction(updateItemOwner);

            // check the owner has changed
            const itemRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.Item');
            const editedItem = await itemRegistry.get(item_id);
            editedItem.currentOwner.getIdentifier().should.equal(business_id);
        });

        // it('updateItemRequest should change the quantity of an item request' , function(){
        //     let result = logic.updateItemRequest();
        //     //Test the result against expected result here

        // });

        // it('updateItemRequest should change the unit price of an item request' , function(){
        //     let result = logic.updateItemRequest();
        //     //Test the result against expected result here

        // });

    });

    /* Contract change tests */
    describe('Contract updates', function(){

        // it('changeContractStatuses should change the status to \'WAITING_CONFIRMATION\'', async () => {
        //     let result = logic.changeContractStatuses();
        //     //Test the result against expected result here

        // });
        it('updateItemRequest should update the itemRequest in a contract', async () => {
            const employee_id = 'B003_E001';
            const contract_id = 'C001';
            const itemRequestIndex = 0;

            // create the transaction
            const updateItemRequest = factory.newTransaction(namespace, 'UpdateItemRequest');
            updateItemRequest.itemRequestIndex = itemRequestIndex;
            updateItemRequest.newUnitPrice = 1;
            updateItemRequest.newQuantity = 2;
            updateItemRequest.contract = factory.newRelationship(namespace, 'Contract', contract_id);
            await businessNetworkConnection.submitTransaction(updateItemRequest);

            // check the contract's itemRequest has been changed
            // unitPrice 14.2 -> 1
            // newQuantity 1 -> 2
            const contractRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.Contract');
            const editedContract = await contractRegistry.get(contract_id);
            editedContract.requestedItems[itemRequestIndex].unitPrice.should.equal(1);
            editedContract.requestedItems[itemRequestIndex].quantity.should.equal(2);
            editedContract.approvalStatusSellingBusiness.should.equal('WAITING_CONFIRMATION');
            editedContract.approvalStatusBuyingBusiness.should.equal('WAITING_CONFIRMATION');
            editedContract.status.should.equal('WAITING_CONFIRMATION');
        });

        it('approveContractChanges should confirm a sellingBusiness\'s contract\'s changes', async () => {
            const employee_id = 'B001_E001';
            const contract_id = 'C001';

            // create the transaction
            const approveContractChanges = factory.newTransaction(namespace, 'ApproveContractChanges');
            approveContractChanges.acceptingEmployee = factory.newRelationship(namespace, 'Employee', employee_id);
            approveContractChanges.contract = factory.newRelationship(namespace, 'Contract', contract_id);
            await businessNetworkConnection.submitTransaction(approveContractChanges);

            // check the contract's sellingBusiness status has changed
            // because the BuyingBusiness has not been changed, the status is still not confirmed!
            const contractRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.Contract');
            const editedContract = await contractRegistry.get(contract_id);
            editedContract.approvalStatusSellingBusiness.should.equal('CONFIRMED');
            editedContract.status.should.equal('WAITING_CONFIRMATION');
        });

        it('approveContractChanges from a different employee should not confirm a contract\'s changes', async () => {
            const employee_id = 'B002_E001';
            const contract_id = 'C001';

            // create the transaction
            const approveContractChanges = factory.newTransaction(namespace, 'ApproveContractChanges');
            approveContractChanges.acceptingEmployee = factory.newRelationship(namespace, 'Employee', employee_id);
            approveContractChanges.contract = factory.newRelationship(namespace, 'Contract', contract_id);
            await businessNetworkConnection.submitTransaction(approveContractChanges);

            // check the contract's approval status has NOT been changed
            const contractRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.Contract');
            const editedContract = await contractRegistry.get(contract_id);
            editedContract.approvalStatusBuyingBusiness.should.equal('WAITING_CONFIRMATION');
            editedContract.status.should.equal('WAITING_CONFIRMATION');
        });

        it('approveContractChanges should confirm a buyingBusiness\'s contract\'s changes', async () => {
            const employee_id = 'B003_E001';
            const contract_id = 'C001';

            // create the transaction
            const approveContractChanges = factory.newTransaction(namespace, 'ApproveContractChanges');
            approveContractChanges.acceptingEmployee = factory.newRelationship(namespace, 'Employee', employee_id);
            approveContractChanges.contract = factory.newRelationship(namespace, 'Contract', contract_id);
            await businessNetworkConnection.submitTransaction(approveContractChanges);

            // check the contract's sellingBusiness && overall status has changed
            const contractRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.Contract');
            const editedContract = await contractRegistry.get(contract_id);
            editedContract.status.should.equal('CONFIRMED');
        });

        it('completeContract should .....', function(){
            const employee_id = 'B003_E001';
            const contract_id = 'C001';

            // create the transaction
            const approveContractChanges = factory.newTransaction(namespace, 'ApproveContractChanges');
            approveContractChanges.acceptingEmployee = factory.newRelationship(namespace, 'Employee', employee_id);
            approveContractChanges.contract = factory.newRelationship(namespace, 'Contract', contract_id);
            await businessNetworkConnection.submitTransaction(approveContractChanges);

            // check the contract's sellingBusiness && overall status has changed
            const contractRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.Contract');
            const editedContract = await contractRegistry.get(contract_id);
            editedContract.status.should.equal('CONFIRMED');
        });

        // it('updateContractArrivalDateTime should change the value of the arrival data and time for the contract', function(){
        //     let result = logic.updateContractArrivalDateTime();
        //     //Test the result against expected result here

        // });

        // it('addShipmentToShipmentList should add a shipment to a contract\'s shipmentList', function(){
        //     let result = logic.addShipmentToShipmentList();
        //     //Test the result against expected result here

        // });

        it('removeShipmentFromShipmentList should remove a shipment from a contract\'s shipmentList', async () => {
            const employee_id = 'B003_E001';
            const contract_id = 'C001';

            // create the transaction
            const removeShipmentFromShipmentList = factory.newTransaction(namespace, 'RemoveShipmentFromShipmentList');
            removeShipmentFromShipmentList.contract = factory.newRelationship(namespace, 'Contract', contract_id);
            removeShipmentFromShipmentList.shipmentIndex = 0;
            await businessNetworkConnection.submitTransaction(removeShipmentFromShipmentList);

            // check the contract's stasuses have changed and the shipment has been removed
            // Went from 1 shipment to 0 shipments in the contract
            const contractRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.Contract');
            const editedContract = await contractRegistry.get(contract_id);
            editedContract.shipments.length.should.equal(0);
        });


        /*it('updateItemOwner should change the owner of the item', async () => {
            const business_id = 'B001';
            const employee_id = 'B003_E001';
            const contract_id = 'C001';

            // create the transaction
            const updateItemOwner = factory.newTransaction(namespace, 'UpdateItemOwner');
            updateItemOwner.currentOwner = factory.newRelationship(namespace, 'Business', business_id);
            updateItemOwner.newOwner = factory.newRelationship(namespace, 'ItemType', 'Adderall');
            itemRequest.unitPrice = 2;
            itemRequest.quantity = 100;
            updateItemOwner.newItemRequests = [itemRequest];
            updateItemOwner.contract = factory.newRelationship(namespace, 'Contract', contract_id);
            await businessNetworkConnection.submitTransaction(updateItemOwner);

            // check the contract's stasuses have changed and the requestedItems have been added to the contract
            // Went from 1 request to 2 in the contract
            const contractRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.Contract');
            const editedContract = await contractRegistry.get(contract_id);
            editedContract.requestedItems.length.should.equal(2);
            editedContract.status.should.equal('WAITING_CONFIRMATION');

        });*/

    //     it('removeItemRequestFromRequestedItemsList should remove an itemRequest from a contract', function(){
    //         let result = logic.removeItemRequestFromRequestedItemsList();
    //         //Test the result against expected result here

    //     });

    });

    // /* User Info change tests */
    // describe('User Info updates', function(){

    //     it('updateUserEmail should change a user\'s email address', function(){
    //         let result = logic.updateUserEmail();
    //         //Test the result against expected result here

    //     });

    //     it('updateUserPassword should change a user\'s password', function(){
    //         let result = logic.updateUserPassword();
    //         //Test the result against expected result here

    //     });

    // });

    // /* Business change tests */
    // describe('Business updates (Admin Info, Inventory, Employee Management)', function(){

    //     it('updateBusinessInfo should change a business\'s information', function(){
    //         let result = logic.updateBusinessInfo();
    //         //Test the result against expected result here

    //     });

    //     it('updateBusinessAccBalance should change the account balance', function(){
    //         let result = logic.updateBusinessAccBalance();
    //         //Test the result against expected result here


    //     });

    //     it('removeItemFromInventory should remove an item from the inventory of a business', function(){
    //         let result = logic.removeItemFromInventory();
    //         //Test the result against expected result here

    //     });

    //     it('addItemToInventory should add an item to the inventory of a business', function(){
    //         let result = logic.addItemToInventory();
    //         //Test the result against expected result here

    //     });

    //     it('removeEmployeeFromBusiness should remove an employee from a business', function(){
    //         let result = logic.removeEmployeeFromBusiness();
    //         //Test the result against expected result here

    //     });

    //     it('addEmployeeToBusiness should add an employee to a business', function(){
    //         let result = logic.addEmployeeToBusiness();
    //         //Test the result against expected result here

    //     });

    // });

    // /* Employee change tests */
    // describe('Employee Info updates', function(){

    //     it('updateEmployeeInfo should change an employee\'s information', function(){
    //         let result = logic.updateEmployeeInfo();
    //         //Test the result against expected result here

    //     });

    //     it('updateEmployeeType should change an employee\'s type of business', function(){
    //         let result = logic.updateEmployeeType();
    //         //Test the result against expected result here

    //     });

    // });






    // putting on hold until deployment works first
    /*
    describe('#shipment', () => {

        it('should receive base price for a shipment within temperature range', () => {
            // submit the temperature reading
            const tempReading = factory.newTransaction(namespace, 'TemperatureReading');
            tempReading.shipment = factory.newRelationship(namespace, 'Shipment', 'SHIP_001');
            tempReading.centigrade = 4.5;
            return businessNetworkConnection.submitTransaction(tempReading)
                .then(() => {
                    // submit the shipment received
                    const received = factory.newTransaction(namespace, 'ShipmentReceived');
                    received.shipment = factory.newRelationship(namespace, 'Shipment', 'SHIP_001');
                    return businessNetworkConnection.submitTransaction(received);
                })
                .then(() => {
                    return businessNetworkConnection.getParticipantRegistry(namespace + '.Manufacturer');
                })
                .then((manufacturerRegistry) => {
                    // check the manufacturer's balance
                    return manufacturerRegistry.get(manufacturer_id);
                })
                .then((newManufacturer) => {
                    // console.log(JSON.stringify(businessNetworkConnection.getBusinessNetwork().getSerializer().toJSON(newManufacturer)));
                    newManufacturer.accountBalance.should.equal(2500);
                })
                .then(() => {
                    return businessNetworkConnection.getParticipantRegistry(namespace + '.Distributor');
                })
                .then((distributorRegistry) => {
                    // check the distributor's balance
                    return distributorRegistry.get(distributor_id);
                })
                .then((newDistributor) => {
                    newDistributor.accountBalance.should.equal(-2500);
                })
                .then(() => {
                    return businessNetworkConnection.getAssetRegistry(namespace + '.Shipment');
                })
                .then((shipmentRegistry) => {
                    // check the state of the shipment
                    return shipmentRegistry.get('SHIP_001');
                })
                .then((shipment) => {
                    shipment.status.should.equal('ARRIVED');
                });
        });

        it('should receive nothing for a late shipment', () => {
            // submit the temperature reading
            const tempReading = factory.newTransaction(namespace, 'TemperatureReading');
            tempReading.shipment = factory.newRelationship(namespace, 'Shipment', 'SHIP_001');
            tempReading.centigrade = 4.5;
            // advance the javascript clock to create a time-advanced test timestamp
            clock.tick(1000000000000000);
            return businessNetworkConnection.submitTransaction(tempReading)
                .then(() => {
                    // submit the shipment received
                    const received = factory.newTransaction(namespace, 'ShipmentReceived');
                    received.shipment = factory.newRelationship(namespace, 'Shipment', 'SHIP_001');
                    return businessNetworkConnection.submitTransaction(received);
                })
                .then(() => {
                    return businessNetworkConnection.getParticipantRegistry(namespace + '.Manufacturer');
                })
                .then((manufacturerRegistry) => {
                    // check the manufacturer's balance
                    return manufacturerRegistry.get(manufacturer_id);
                })
                .then((newManufacturer) => {
                    // console.log(JSON.stringify(businessNetworkConnection.getBusinessNetwork().getSerializer().toJSON(newManufacturer)));
                    newManufacturer.accountBalance.should.equal(2500);
                })
                .then(() => {
                    return businessNetworkConnection.getParticipantRegistry(namespace + '.Distributor');
                })
                .then((distributorRegistry) => {
                    // check the distributor's balance
                    return distributorRegistry.get(distributor_id);
                })
                .then((newDistributor) => {
                    newDistributor.accountBalance.should.equal(-2500);
                });
        });

        it('should apply penalty for min temperature violation', () => {
            // submit the temperature reading
            const tempReading = factory.newTransaction(namespace, 'TemperatureReading');
            tempReading.shipment = factory.newRelationship(namespace, 'Shipment', 'SHIP_001');
            tempReading.centigrade = 1;
            return businessNetworkConnection.submitTransaction(tempReading)
                .then(() => {
                    // submit the shipment received
                    const received = factory.newTransaction(namespace, 'ShipmentReceived');
                    received.shipment = factory.newRelationship(namespace, 'Shipment', 'SHIP_001');
                    return businessNetworkConnection.submitTransaction(received);
                })
                .then(() => {
                    return businessNetworkConnection.getParticipantRegistry(namespace + '.Manufacturer');
                })
                .then((manufacturerRegistry) => {
                    // check the manufacturer's balance
                    return manufacturerRegistry.get(manufacturer_id);
                })
                .then((newManufacturer) => {
                    // console.log(JSON.stringify(businessNetworkConnection.getBusinessNetwork().getSerializer().toJSON(newManufacturer)));
                    newManufacturer.accountBalance.should.equal(4000);
                })
                .then(() => {
                    return businessNetworkConnection.getParticipantRegistry(namespace + '.Distributor');
                })
                .then((distributorRegistry) => {
                    // check the distributor's balance
                    return distributorRegistry.get(distributor_id);
                })
                .then((newDistributor) => {
                    newDistributor.accountBalance.should.equal(-4000);
                });
        });

        it('should apply penalty for max temperature violation', () => {
            // submit the temperature reading
            const tempReading = factory.newTransaction(namespace, 'TemperatureReading');
            tempReading.shipment = factory.newRelationship(namespace, 'Shipment', 'SHIP_001');
            tempReading.centigrade = 11;
            return businessNetworkConnection.submitTransaction(tempReading)
                .then(() => {
                    // submit the shipment received
                    const received = factory.newTransaction(namespace, 'ShipmentReceived');
                    received.shipment = factory.newRelationship(namespace, 'Shipment', 'SHIP_001');
                    return businessNetworkConnection.submitTransaction(received);
                })
                .then(() => {
                    return businessNetworkConnection.getParticipantRegistry(namespace + '.Manufacturer');
                })
                .then((manufacturerRegistry) => {
                    // check the manufacturer's balance
                    return manufacturerRegistry.get(manufacturer_id);
                })
                .then((newManufacturer) => {
                    // console.log(JSON.stringify(businessNetworkConnection.getBusinessNetwork().getSerializer().toJSON(newManufacturer)));
                    newManufacturer.accountBalance.should.equal(5000);
                })
                .then(() => {
                    return businessNetworkConnection.getParticipantRegistry(namespace + '.Distributor');
                })
                .then((distributorRegistry) => {
                    // check the distributor's balance
                    return distributorRegistry.get(distributor_id);
                })
                .then((newDistributor) => {
                    newDistributor.accountBalance.should.equal(-5000);
                });
        });
    });
    */
});