# Medicine Asset Tracking

> Business network consisting of Manfuacturers, Carriers, and Distributors.  Businesses defining contracts for the price of medicine, based on temperature readings received for shipping containers.

The business network defines a contract between manufacturers and distributors. The contract stipulates that: On receipt of the shipment the Distributor pays the Manufacturer the unit price x the number of units in the shipment. Shipments that arrive late are free. Shipments that have breached the low temperate threshold have a penalty applied proportional to the magnitude of the breach x a penalty factor. Shipments that have breached the high temperate threshold have a penalty applied proportional to the magnitude of the breach x a penalty factor.

This business network defines:

**Participants**
`Manufacturer` `Distributor` `Carrier`

**Assets**
`Contract` `Shipment`

**Transactions**
`TemperatureReading` `ShipmentReceived` `SetupDemo`

To test this Business Network Definition in the **Test** tab:

Submit a `SetupDemo` transaction:

```
{
  "$class": "org.mat.SetupDemo"
}
```

This transaction populates the Participant Registries with a `Manufacturer`, an `Distributor` and a `Carrier`. The Asset Registries will have a `Contract` asset and a `Shipment` asset.

Submit a `TemperatureReading` transaction:

```
{
  "$class": "org.mat.TemperatureReading",
  "centigrade": 8,
  "shipment": "resource:org.mat.Shipment#SHIP_001"
}
```

If the temperature reading falls outside the min/max range of the contract, the price received by the Manufacturer will be reduced. You may submit several readings if you wish. Each reading will be aggregated within `SHIP_001` Shipment Asset Registry.

Submit a `ShipmentReceived` transaction for `SHIP_001` to trigger the payout to the Manufacturer, based on the parameters of the `CON_001` contract:

```
{
  "$class": "org.mat.ShipmentReceived",
  "shipment": "resource:org.mat.Shipment#SHIP_001"
}
```

If the date-time of the `ShipmentReceived` transaction is after the `arrivalDateTime` on `CON_001` then the Manufacturer will no receive any payment for the shipment.

Congratulations!