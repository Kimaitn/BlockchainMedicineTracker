# Hyperledger Composer Development - Multiple Machines

This tutorial assumes that you have all pre-reqs installed for the previous `mat-network.bna` tutorial on multiple AWS ec2 instances.

** This includes steps like installing `cryptogen` and `export PATH=$HOME/fabric-samples/bin:$PATH` (if the path hasn't been already set) **

## Pre-reqs to deployment
Place the `blockchain` folder onto one of the machines.

1. `cd ./blockchain`
1. `./teardownFabric.sh`
1. `rm -rf composer/crypto-config`

## Steps to deploy the Fabric as of 1.1
Within the `blockchain` folder:

1. `./begin.sh`
1. EDIT THE FOLLOWING TWO FILES:
  o `docker-compose.yml`, 
    - find `<CA_CERT>` and replace it with the full name of the `_sk` file in `composer/crypto-config/peerOrganizations/org1.example.com/ca/`
    - find `<PEER-1-IP>` and replace it with machine one's IP address
  o `createPeerAdminCard.sh`
    - find `<KEYSTORE>` and replace it with the full name of the `_sk` file in  `composer/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/` in `./createPeerAdminCard.sh`
    - find `<PEER-2-IP>` and replace it with machine two's IP address
1. use the following command to copy the `blockchain` folder onto the other machine
`scp -i {PEM_FILE_NAME}.pem -r {DIRECTORY_TO_BLOCKCHAIN_FOLDER} ${PEER-2-IP}:${DIRECTORY_FOR_BLOCKCHAIN_FOLDER}`
1. on the first PC: `./startFabric.sh && ./createPeerAdminCard.sh`
1. on the second PC: `./startFabric-Peer2.sh`

## Using Composer to deploy a Fabric instance as of 0.19
You will need to add `mat-network.bna` in the current working directory. The directory doesn't matter, but `networkadmin.card` will be saved in it, so doing this in `blockchain` would probably be best.

1. `composer network install --card PeerAdmin@hlfv1 --archiveFile mat-network.bna`,
1. `composer network start -n mat-network -V 0.0.1 -A admin -S adminpw --card PeerAdmin@hlfv1 -f networkadmin.card`
1. `composer card import -f networkadmin.card --card admin@mat-network`

You did it! From here you can:
o `composer network ping --card admin@mat-network` to ping the network
o `composer-rest-server --card admin@mat-network` to deploy the rest server
    