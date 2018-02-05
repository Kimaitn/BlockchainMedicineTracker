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

/**
 * A shipment has been received by an retailer
 * @param {org.mat.ShipmentReceived} shipmentReceived - the ShipmentReceived transaction
 * @transaction
 */
function payOut(shipmentReceived) {

    var contract = shipmentReceived.shipment.contract;
    var shipment = shipmentReceived.shipment;
    var payOut = contract.unitPrice * shipment.unitCount;

    console.log('Received at: ' + shipmentReceived.timestamp);
    console.log('Contract arrivalDateTime: ' + contract.arrivalDateTime);

    // set the status of the shipment
    shipment.status = 'ARRIVED';

    // if the shipment did not arrive on time the payout is zero
    if (shipmentReceived.timestamp > contract.arrivalDateTime) {
        payOut = 0;
        console.log('Late shipment');
    } else {
        // find the lowest temperature reading
        if (shipment.temperatureReadings) {
            // sort the temperatureReadings by centigrade
            shipment.temperatureReadings.sort(function (a, b) {
                return (a.centigrade - b.centigrade);
            });
            var lowestReading = shipment.temperatureReadings[0];
            var highestReading = shipment.temperatureReadings[shipment.temperatureReadings.length - 1];
            var penalty = 0;
            console.log('Lowest temp reading: ' + lowestReading.centigrade);
            console.log('Highest temp reading: ' + highestReading.centigrade);

            // does the lowest temperature violate the contract?
            if (lowestReading.centigrade < contract.minTemperature) {
                penalty += (contract.minTemperature - lowestReading.centigrade) * contract.minPenaltyFactor;
                console.log('Min temp penalty: ' + penalty);
            }

            // does the highest temperature violate the contract?
            if (highestReading.centigrade > contract.maxTemperature) {
                penalty += (highestReading.centigrade - contract.maxTemperature) * contract.maxPenaltyFactor;
                console.log('Max temp penalty: ' + penalty);
            }

            // apply any penalities
            payOut -= (penalty * shipment.unitCount);

            if (payOut < 0) {
                payOut = 0;
            }
        }
    }

    console.log('Payout: ' + payOut);
    contract.manufacturer.accountBalance += payOut;
    contract.retailer.accountBalance -= payOut;

    console.log('Manufacturer: ' + contract.manufacturer.$identifier + ' new balance: ' + contract.manufacturer.accountBalance);
    console.log('Retailer: ' + contract.retailer.$identifier + ' new balance: ' + contract.retailer.accountBalance);

    return getParticipantRegistry('org.mat.Manufacturer')
        .then(function (manufacturerRegistry) {
            // update the manufacturer's balance
            return manufacturerRegistry.update(contract.manufacturer);
        })
        .then(function () {
            return getParticipantRegistry('org.mat.Retailer');
        })
        .then(function (retailerRegistry) {
            // update the retailer's balance
            return retailerRegistry.update(contract.retailer);
        })
        .then(function () {
            return getAssetRegistry('org.mat.Shipment');
        })
        .then(function (shipmentRegistry) {
            // update the state of the shipment
            return shipmentRegistry.update(shipment);
        });
}

/**
 * A temperature reading has been received for a shipment
 * @param {org.mat.TemperatureReading} temperatureReading - the TemperatureReading transaction
 * @transaction
 */
function temperatureReading(temperatureReading) {

    var shipment = temperatureReading.shipment;

    console.log('Adding temperature ' + temperatureReading.centigrade + ' to shipment ' + shipment.$identifier);

    if (shipment.temperatureReadings) {
        shipment.temperatureReadings.push(temperatureReading);
    } else {
        shipment.temperatureReadings = [temperatureReading];
    }

    return getAssetRegistry('org.mat.Shipment')
        .then(function (shipmentRegistry) {
            // add the temp reading to the shipment
            return shipmentRegistry.update(shipment);
        });
}

/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {org.mat.SetupDemo} setupDemo - the SetupDemo transaction
 * @transaction
 */
function setupDemo(setupDemo) {

    var factory = getFactory();
    var NS = 'org.mat';

    // create the manufacturer
    var mName = 'UCF';
    var mId = mName.toLowerCase();
    var manufacturer = factory.newResource(NS, 'Manufacturer', mId);
    var manufacturerAddress = factory.newConcept(NS, 'Address');
    manufacturerAddress.country = 'USA';
    manufacturerAddress.city = 'Orlando'
    manufacturerAddress.street = '4000 Central Florida Blvd'
    manufacturerAddress.zip = '32816';
    manufacturer.address = manufacturerAddress;
    manufacturer.name = mName;
    manufacturer.email = 'manu@ucf.com';
    manufacturer.contact = 'Felicia Taslk'
    manufacturer.accountBalance = 0;

    // create the retailer
    var rName = 'FSU';
    var rId = rName.toLowerCase();
    var retailer = factory.newResource(NS, 'Retailer', rId);
    retailer.name = rName;
    retailer.email = 'retail@fsu.com';
    retailer.contact = 'Matthew Barnale';
    retailer.accountBalance = 0;

    // create the carrier
    var cName = 'Harvard';
    var cId = cName.toLowerCase();
    var carrier = factory.newResource(NS, 'Carrier', cId);
    carrier.name = cName;
    carrier.email = 'carrier@harvard.edu';
    carrier.contact = 'Held Responsible';
    carrier.accountBalance = 0;

    // create the contract
    var contract = factory.newResource(NS, 'Contract', 'CON_001');
    contract.manufacturer = factory.newRelationship(NS, 'Manufacturer', mId);
    contract.retailer = factory.newRelationship(NS, 'Retailer', rId);
    contract.carrier = factory.newRelationship(NS, 'Carrier', cId);
    var tomorrow = setupDemo.timestamp;
    tomorrow.setDate(tomorrow.getDate() + 1);
    contract.arrivalDateTime = tomorrow; // the shipment has to arrive tomorrow
    contract.unitPrice = 0.5; // pay 50 cents per unit
    contract.minTemperature = 2; // min temperature for the cargo
    contract.maxTemperature = 10; // max temperature for the cargo
    contract.minPenaltyFactor = 0.2; // we reduce the price by 20 cents for every degree below the min temp
    contract.maxPenaltyFactor = 0.1; // we reduce the price by 10 cents for every degree above the max temp

    // create the shipment
    var shipment = factory.newResource(NS, 'Shipment', 'SHIP_001');
    shipment.type = 'Adderall';
    shipment.status = 'IN_TRANSIT';
    shipment.unitCount = 5000;
    shipment.contract = factory.newRelationship(NS, 'Contract', 'CON_001');
    return getParticipantRegistry(NS + '.Manufacturer')
        .then(function (manufacturerRegistry) {
            // add the manufacturers
            return manufacturerRegistry.addAll([manufacturer]);
        })
        .then(function() {
            return getParticipantRegistry(NS + '.Retailer');
        })
        .then(function(retailerRegistry) {
            // add the retailers
            return retailerRegistry.addAll([retailer]);
        })
        .then(function() {
            return getParticipantRegistry(NS + '.Carrier');
        })
        .then(function(carrierRegistry) {
            // add the carriers
            return carrierRegistry.addAll([carrier]);
        })
        .then(function() {
            return getAssetRegistry(NS + '.Contract');
        })
        .then(function(contractRegistry) {
            // add the contracts
            return contractRegistry.addAll([contract]);
        })
        .then(function() {
            return getAssetRegistry(NS + '.Shipment');
        })
        .then(function(shipmentRegistry) {
            // add the shipments
            return shipmentRegistry.addAll([shipment]);
        });
}