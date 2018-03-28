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


function MEDS(h1, h2, h3, h4, h5, h6){
    this.MedNum = h1;
    this.MedName = h2;
    this.MedUnitOfMeasure = h3;
    this.MedQuantity = h4;
    this.MedCompany = h5
    this.MedLocation = h6;

}

function Parser(bulkLoad){
    var data = file.split("\n");
    
    return data.map(function (data) {
        return data.split(",");
    });

}

function ToArray(data){
    var DataStore= [];

    for(var i =0; i< data.length; i++){
        DataStore.push(new MEDS(data[i][0], data[i][1], data[i][2], data[i][3], data[i][4], data[i][5]));
    }
}






