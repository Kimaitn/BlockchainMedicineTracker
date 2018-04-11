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
const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;
const IdCard = require('composer-common').IdCard;
const MemoryCardStore = require('composer-common').MemoryCardStore;
const path = require('path');

require('chai').should();
let sinon = require('sinon');

const namespace = 'org.mat';
let manufacturer_id = 'BobRoss@gmail.com';
let shipper_id = 'BobDDoss@gmail.com';
let distributor_id = 'BobDDoss@gmail.com';


//TODO: Verify that cardStore definition is correct and not TOO sketchy
describe('Perishable Shipping Network', () => {
    // In-memory card store for testing so cards are not persisted to the file system
    //const cardStore = new MemoryCardStore();
    const cardStore = require('composer-common').MemoryCardStore; //THIS IS A SKETCHY WORKAROUND, SEE ABOVE
    let adminConnection;
    let businessNetworkConnection;
    let factory;
    let clock;

    before(() => {
        // Embedded connection used for local testing
        const connectionProfile = {
            name: 'embedded',
            type: 'embedded'
        };
        // Embedded connection does not need real credentials
        const credentials = {
            certificate: 'FAKE CERTIFICATE',
            privateKey: 'FAKE PRIVATE KEY'
        };

        // PeerAdmin identity used with the admin connection to deploy business networks
        const deployerMetadata = {
            version: 1,
            userName: 'PeerAdmin',
            roles: [ 'PeerAdmin', 'ChannelAdmin' ]
        };
        const deployerCard = new IdCard(deployerMetadata, connectionProfile);
        deployerCard.setCredentials(credentials);

        const deployerCardName = 'PeerAdmin';
        adminConnection = new AdminConnection({ cardStore: cardStore });

        const adminUserName = 'admin';
        let adminCardName;
        let businessNetworkDefinition;

        return adminConnection.importCard(deployerCardName, deployerCard).then(() => {
            return adminConnection.connect(deployerCardName);
        }).then(() => {
            businessNetworkConnection = new BusinessNetworkConnection({ cardStore: cardStore });

            return BusinessNetworkDefinition.fromDirectory(path.resolve(__dirname, '..'));
        }).then(definition => {
            businessNetworkDefinition = definition;
            // Install the Composer runtime for the new business network
            return adminConnection.install(businessNetworkDefinition.getName());
        }).then(() => {
            // Start the business network and configure an network admin identity
            const startOptions = {
                networkAdmins: [
                    {
                        userName: adminUserName,
                        enrollmentSecret: 'adminpw'
                    }
                ]
            };
            return adminConnection.start(businessNetworkDefinition, startOptions);
        }).then(adminCards => {
            // Import the network admin identity for us to use
            adminCardName = `${adminUserName}@${businessNetworkDefinition.getName()}`;
            return adminConnection.importCard(adminCardName, adminCards.get(adminUserName));
        }).then(() => {
            // Connect to the business network using the network admin identity
            return businessNetworkConnection.connect(adminCardName);
        }).then(() => {
            factory = businessNetworkConnection.getBusinessNetwork().getFactory();
            const setupDemo = factory.newTransaction(namespace, 'SetupDemo');
            return businessNetworkConnection.submitTransaction(setupDemo);
        });
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

    const logic = require('../lib/logic');
    const assert = require('chai').assert;


    /* Item change tests */
    describe('Item Value updates', function(){

        it('updateItemOwner should change the owner value of the item' , function(){
            let result = logic.updateItemOwner();
            //Test the result against expected result here (???)
            //assert.equal(result, );

        });

        it('updateItemRequest should change the quantity of an item request' , function(){
            let result = logic.updateItemRequest();
            //Test the result against expected result here

        });

        it('updateItemRequest should change the unit price of an item request' , function(){
            let result = logic.updateItemRequest();
            //Test the result against expected result here

        });

    });

    /* Contract change tests */
    describe('Contract updates', function(){

        it('changeContractStatuses should change the status to \'WAITING_CONFIRMATION\'', function(){
            let result = logic.changeContractStatuses();
            //Test the result against expected result here

        });

        it('approveContractChanges should confirm a contracts changes\'', function(){
            let result = logic.approveContractChanges();
            //Test the result against expected result here

        });

        it('completeContract should .....', function(){
            let result = logic.completeContract();
            //Test the result against expected result here

        });

        it('updateContractArrivalDateTime should change the value of the arrival data and time for the contract', function(){
            let result = logic.updateContractArrivalDateTime();
            //Test the result against expected result here

        });

    });

    /* Shipment change tests */
    describe('Shipment updates', function(){

        it('addShipmentToShipmentList should add a shipment to a contract\'s shipmentList', function(){
            let result = logic.addShipmentToShipmentList();
            //Test the result against expected result here

        });

        it('removeShipmentToShipmentList should remove a shipment from a contract\'s shipmentList', function(){
            let result = logic.removeShipmentToShipmentList();
            //Test the result against expected result here


        });

    });

    /* itemRequest change tests */
    describe('Item Request updates', function(){

        it('addItemRequestToRequestedItemsList should add an itemRequest to a contract', function(){
            let result = logic.addItemRequestToRequestedItemsList();
            //Test the result against expected result here

        });

        it('removeItemRequestFromRequestedItemsList should remove an itemRequest from a contract', function(){
            let result = logic.removeItemRequestFromRequestedItemsList();
            //Test the result against expected result here

        });

    });

    /* User Info change tests */
    describe('User Info updates', function(){

        it('updateUserEmail should change a user\'s email address', function(){
            let result = logic.updateUserEmail();
            //Test the result against expected result here

        });

        it('updateUserPassword should change a user\'s password', function(){
            let result = logic.updateUserPassword();
            //Test the result against expected result here

        });

    });

    /* Business change tests */
    describe('Business updates (Admin Info, Inventory, Employee Management)', function(){

        it('updateBusinessInfo should change a business\'s information', function(){
            let result = logic.updateBusinessInfo();
            //Test the result against expected result here

        });

        it('updateBusinessAccBalance should change the account balance', function(){
            let result = ogic.updateBusinessAccBalance();
            //Test the result against expected result here


        });

        it('removeItemFromInventory should remove an item from the inventory of a business', function(){
            let result = logic.removeItemFromInventory();
            //Test the result against expected result here

        });

        it('addItemToInventory should add an item to the inventory of a business', function(){
            let result = logic.addItemToInventory();
            //Test the result against expected result here

        });

        it('removeEmployeeFromBusiness should remove an employee from a business', function(){
            let result = logic.removeEmployeeFromBusiness();
            //Test the result against expected result here

        });

        it('addEmployeeToBusiness should add an employee to a business', function(){
            let result = logic.addEmployeeToBusiness();
            //Test the result against expected result here

        });

    });

    /* Employee change tests */
    describe('Exmployee Info updates', function(){

        it('updateEmployeeInfo should change an employee\'s information', function(){
            let result = logic.updateEmployeeInfo();
            //Test the result against expected result here

        });

        it('updateEmployeeType should change an employee\'s type of business', function(){
            let result = logc.updateEmployeeType();
            //Test the result against expected result here

        });

    });






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