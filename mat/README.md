# Hyperledger Composer Development

You will need to setup your entire Hyperledger Fabric first before 
firing up your personal network

## Environment Setup Commands (First Time Deployment)

Download hyperledger client and tools (or `npm update` if you have already installed)
The `fabric-tools` folder should be outside of the current project directory

```
npm install -g composer-cli
npm install -g generator-hyperledger-composer
npm install -g composer-rest-server

mkdir fabric-tools
cd fabric-tools
curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.zip
unzip fabric-dev-servers.zip
```

## Pre-Deployment Procedures

```
docker kill $(docker ps -q)
docker rm $(docker ps -aq)
docker rmi $(docker images dev-* -q)
```

## Deployment 

Start Hyperledger Fabric

within the `fabric-tools` folder:
```
./downloadFabric.sh
./startFabric.sh
./createPeerAdminCard.sh
```

## Project Setup/Deployment Commands

Create your `.bna` file within $(PROJECT FOLDER).
In this case, it'll be within `mat`

```
mkdir dist
composer archive create --sourceType dir --sourceName . -a ./dist/mat-network.bna
```

Deploy the network

```
composer runtime install --card PeerAdmin@hlfv1 --businessNetworkName mat-network
composer network start --card PeerAdmin@hlfv1 -A admin -S adminpw -a mat-network.bna -f networkadmin.card
composer card import -f networkadmin.card
composer card list
composer network ping --card admin@mat-network
```

## The REST server

`composer-rest-server --card admin@mat-network -m true`

You will need to import your identity card to use the REST server.