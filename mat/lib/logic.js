/**
 * Track the trade of a commodity from one trader to another
 * @param {org.mat.ItemTransaction} itemTransaction - the trade to be processed
 * @transaction
 */
function tradeCommodity(itemTransaction) {
    itemTransaction.item.currentOwner = itemTransaction.newOwner;
    return getAssetRegistry('org.mat.Item')
        .then(function (assetRegistry) {
            return assetRegistry.update(itemTransaction.item);
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
    const mAddress = factory.newConcept(org, 'Address');
    carrier.name = 'McKesson';
    carrier.businessType = 'Carrier';
    carrier.PoCName = 'Bob Loss';
    carrier.PoCEmail = 'BobLoss@gmail.com';
    mAddress.street = 'One Post Street';
    mAddress.city = 'San Francisco';
    mAddress.state = 'CA';
    mAddress.country = 'USA';
    mAddress.zip = '94104';
    carrier.address = mAddress;
    carrier.accountBalance = 55.54;

    // create the distributor
    const distributor = factory.newResource(org, 'Business', 'B003');
    const mAddress = factory.newConcept(org, 'Address');
    carrier.name = 'CVS Pharmacy';
    carrier.businessType = 'Distributor';
    carrier.PoCName = 'Bob DDos';
    carrier.PoCEmail = 'BobDDos@gmail.com';
    mAddress.street = 'One CVS Drive';
    mAddress.city = 'Woonsocket';
    mAddress.state = 'RI';
    mAddress.country = 'USA';
    mAddress.zip = '02895';
    carrier.address = mAddress;
    carrier.accountBalance = 645.64;

    // create the contract
    /*
    const contract = factory.newResource(org, 'Contract', 'CON_001');
    contract.grower = factory.newRelationship(org, 'Grower', 'farmer@email.com');
    contract.importer = factory.newRelationship(org, 'Importer', 'supermarket@email.com');
    contract.shipper = factory.newRelationship(org, 'Shipper', 'shipper@email.com');
    const tomorrow = setupDemo.timestamp;
    tomorrow.setDate(tomorrow.getDate() + 1);
    contract.arrivalDateTime = tomorrow; // the shipment has to arrive tomorrow
    contract.unitPrice = 0.5; // pay 50 cents per unit
    */

    // create ItemType
    const itemType = factory.newResource(org, 'ItemType', 'Adderall');

   o String shipmentId
   o Status status
   o ItemType itemType
   o Business currentOwner
   o Address destinationAddress
   o Address sourceAddress
   --> Contract contract
   --> Item[] items

    // create Item
    const item = factory.newResource(org, 'Item', 'I001');
    carrier.name = 'CVS Pharmacy';
    carrier.businessType = 'Distributor';
    carrier.PoCName = 'Bob DDos';
    carrier.PoCEmail = 'BobDDos@gmail.com';
    mAddress.street = 'One CVS Drive';
    mAddress.city = 'Woonsocket';
    mAddress.state = 'RI';
    mAddress.country = 'USA';
    mAddress.zip = '02895';
    carrier.address = mAddress;
    carrier.accountBalance = 645.64;

    /*// create the shipment
    const shipment = factory.newResource(org, 'Shipment', 'S001');
    shipment.status = 'IN_TRANSIT';
    shipment.unitCount = 5000;
    shipment.contract = factory.newRelationship(org, 'Contract', 'CON_001');
    */

    // add the manufacturer
    const growerRegistry = await getParticipantRegistry(org + '.Grower');
    await growerRegistry.addAll([grower]);

    // add the carrier
    const importerRegistry = await getParticipantRegistry(org + '.Importer');
    await importerRegistry.addAll([importer]);

    // add the distributor
    const shipperRegistry = await getParticipantRegistry(org + '.Shipper');
    await shipperRegistry.addAll([shipper]);

    /*// add the contracts
    const contractRegistry = await getAssetRegistry(org + '.Contract');
    await contractRegistry.addAll([contract]);*/

    // add the shipments
    const shipmentRegistry = await getAssetRegistry(org + '.Shipment');
    await shipmentRegistry.addAll([shipment]);
}