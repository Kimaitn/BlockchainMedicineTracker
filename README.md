# Medicine Asset Tracking

> Business network consisting of Manfuacturers, Carriers, and Distributors.  Businesses defining contracts for the price of medicine, based on temperature readings received for shipping containers.

The business network defines a contract between manufacturers and distributors. The contract stipulates that: On receipt of the shipment the Distributor pays the Manufacturer the unit price x the number of units in the shipment. Shipments that arrive late are free. Shipments that have breached the low temperate threshold have a penalty applied proportional to the magnitude of the breach x a penalty factor. Shipments that have breached the high temperate threshold have a penalty applied proportional to the magnitude of the breach x a penalty factor.

This business network defines:

**Participants**
`Manufacturer` `Distributor` `Carrier`

**Assets**
`Contract` `Shipment`

**Transactions**
TBD