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
