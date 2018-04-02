'use strict';

/**
 * Track the trade of a commodity from one trader to another
 * @param {org.mat.ItemTransaction} itemTransaction - the trade to be processed
 * @transaction
 */
async function tradeCommodity(itemTransaction) {
    itemTransaction.item.currentOwner = itemTransaction.newOwner;
    return getAssetRegistry('org.mat.Item')
        .then(function (assetRegistry) {
            return assetRegistry.update(itemTransaction.item);
        });
}

function MEDS(h1, h2, h3, h4, h5, h6){
    this.MedNum = h1;
    this.MedName = h2;
    this.MedUnitOfMeasure = h3;
    this.MedQuantity = h4;
    this.MedCompany = h5
    this.MedLocation = h6;
}

function Parser(bulkLoad){
    const addResources = await getAssetRegistry(namespace + '.bulkLoad');
    const resources = [];

    bulkLoad.forEach(function(item) {
        resources.push(new MEDS(item.medicineNumber, item.medicineName, item.unitOfMeasure, item.medicineQuantity, item.owner, item.medicineLocation));
    });

    await addResources.addALL(resources);
}







