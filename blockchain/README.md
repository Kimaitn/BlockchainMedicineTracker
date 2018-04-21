# Hyperledger Composer Development - Multiple Machines


## Prerequisites
This tutorial assumes that you have all pre-reqs installed for the previous `mat-network.bna` tutorial. 
Additionally, pre-reqs for fabric must have been installed as well from the `curl -sSL https://goo.gl/6wtTN5 | bash -s 1.1.0` command on all of the machine instances.
Ensure that you have set the path to the platform-specific binaries using a command _like_ `export PATH=$HOME/fabric-samples/bin:$PATH`.
When this project was last deployed, it utilized the following:
* Two t2.medium ec2 Linux instances
* Fabric v 1.1
* Composer v 0.19
* Docker v 18.03.0-ce

## Important Commands
Before beginning the tutorial, certain commands will prove to be helpful, and labeling them beforehand will help in readability.
```
{
  scp: scp -i ${PATH_TO_PEM_FILE} -r ${DIRECTORY_TO_BLOCKCHAIN_FOLDER} ${PEER-IP}:${DIRECTORY_FOR_BLOCKCHAIN_FOLDER} 
  ssh: ssh -i ${PATH_TO_PEM_FILE} ${PEER-IP}
  sshfs: sudo sshfs -o allow_other -o "IdentityFile=${PATH_TO_PEM_FILE}" ${PEER-IP}:${DIRECTORY_FOR_BLOCKCHAIN_FOLDER} ${DIRECTORY_TO_BLOCKCHAIN_FOLDER}
}
```

`scp` allows you to copy one folder from one machine to another.  It should be noted that this will probably be done on your local computer since the `{PEM_FILE}` will most likely be on there.
`ssh` allows you to connect to a remote machine / ec2 instance from your local machine.
`sshfs` allows you to connect a directory from a remote machine onto your local computer.  Any changes you made in the targeted folder (either locally or remotely) will be reflected on the opposite targeted folder.

## Preparing Deployment
Place the `blockchain` folder onto one of the machines and set it as your current working directory.  You may want to use the `scp` command for this folder, as you'll be changing a lot of remote files.  Doing this via terminal may prove to be difficult.

## Clearing Previous Fabric Instances
If there already is an instance of fabric running, run the following commands to remove them.
* `./teardownFabric.sh`
* `rm -rf composer/crypto-config`
The `./teardownFabric.sh` command has been modified to remove all docker containers, so be careful when executing this command.

## Sparknotes deployment
run `./deploy.sh` in the `blockchain` folder and skip to step 3 of the next part of the tutorial.

## Steps to deploy the Fabric as of 1.1
Within the `blockchain` folder on machine 1:

1. Within the `composer` folder, run `./begin.sh`.  This will generate all the necessary certificates and place them in the `cryto-config` folder.
1. EDIT THE FOLLOWING TWO FILES:
  * **docker-compose.yml**
    - find `<CA_CERT>` and replace it with the full name of the `_sk` file in `composer/crypto-config/peerOrganizations/org1.example.com/ca/`.
    - find `<PEER-1-IP>` and replace it with machine one's IP address.  This will specify what IP `orderer.example.com` will point to.
  * **createPeerAdminCard.sh**
    - find `<KEYSTORE>` and replace it with the full name of the `_sk` file in  `composer/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/`.
    - find `<PEER-2-IP>` and replace it with machine two's IP address.  This will specify what IP `peer2` will be at.
1. Use the `scp` command to copy the `blockchain` folder onto machine two.  Replace `${PEER-IP}` in the script with machine two's IP.  You will probably have the best luck copying from your local computer with the `sshfs` target folder as the source folder.
1. On the first machine: `./startFabric.sh && ./createPeerAdminCard.sh`
1. On the second machine: `./startFabric-peer2.sh`

## Using Composer to deploy a business network on Fabric
You will need to add `mat-network.bna` (or whatever `.bna` file you will be using) in the current working directory. The directory doesn't matter, but `networkadmin.card` will be saved in it, so doing this in `blockchain` would probably be best.

1. `composer network install --card PeerAdmin@hlfv1 --archiveFile mat-network.bna`
1. `composer network start -n mat-network -V 0.0.1 -A admin -S adminpw --card PeerAdmin@hlfv1 -f networkadmin.card`
1. `composer card import -f networkadmin.card --card admin@mat-network`

You did it! From here you can:
* `composer network ping --card admin@mat-network` to ping the network
* `composer-rest-server --card admin@mat-network` to deploy the rest server

## How `x` # of Peers Works
Within `./createPeerAdminCard.sh`, the following `cat` file is created to start the network:
```
cat << EOF > DevServer_connection.json
{
    "name": "hlfv1",
    "x-type": "hlfv1",
    "x-commitTimeout": 300,
    "version": "1.0.0",
    "client": {
        "organization": "Org1",
        "connection": {
            "timeout": {
                "peer": {
                    "endorser": "300",
                    "eventHub": "300",
                    "eventReg": "300"
                },
                "orderer": "300"
            }
        }
    },
    "channels": {
        "composerchannel": {
            "orderers": [
                "orderer.example.com"
            ],
            "peers": {
                "peer0.org1.example.com": {},
                "peer1.org1.example.com": {},
                "peer2.org1.example.com": {}
            }
        }
    },
    "organizations": {
        "Org1": {
            "mspid": "Org1MSP",
            "peers": [
                "peer0.org1.example.com",
                "peer1.org1.example.com",
                "peer2.org1.example.com"
            ],
            "certificateAuthorities": [
                "ca.org1.example.com"
            ]
        }
    },
    "orderers": {
        "orderer.example.com": {
            "url": "grpc://${HOST}:7050"
        }
    },
    "peers": {
        "peer0.org1.example.com": {
            "url": "grpc://${HOST}:7051",
            "eventUrl": "grpc://${HOST}:7053"
        },
        "peer1.org1.example.com": {
            "url": "grpc://${HOST}:8051",
            "eventUrl": "grpc://${HOST}:8053"
        },
        "peer2.org1.example.com": {
            "url": "grpc://<PEER-2-IP>:9051",
            "eventUrl": "grpc://<PEER-2-IP>:9053"
        }
    },
    "certificateAuthorities": {
        "ca.org1.example.com": {
            "url": "http://${HOST}:7054",
            "caName": "ca.org1.example.com"
        }
    }
}
EOF
```
This ceates the `DevServer_connection.json` within the `blockchain` folder and can be edited for any number of peers.  Wherever peer2 is mentioned, more peers can be created to to expand the network.  Alternatively, all peer2 instances can be deleted in order to only have one peer be connected to the network.  The `peers` key specifies where to hit each peer.  In the case of peer0 and peer1, the first machine will host them.  For any new hosts, different ports will have to be specified.

`crypto-config.yaml` generates the `crypto-config` folder.  In this project, 3 peers were created, peers 0-2.  To change the number of peers in the network that certificates must be generated for, change the `Count` variable under the `Template` key.
```
OrdererOrgs:
  - Name: Orderer
    Domain: example.com
    Specs:
      - Hostname: orderer
PeerOrgs:
  - Name: Org1
    Domain: org1.example.com
    Template:
      Count: 3
    Users:
      Count: 0
```

Finally, there must be as many `startFabric.sh` and `docker-compose.yml` files as there are hosts in the network.  Ports will have to be changed, and any reference to `peer2` will be changed to `peer#`, where # is the number of the peer.  

## What's Next
* Importing a card for the second peer
* Deploying for multiple organizations
* Setting up the angular project

## Credits
Thanks to https://discourse.skcript.com/t/setting-up-a-blockchain-business-network-with-hyperledger-fabric-composer-running-in-multiple-physical-machine/602 for providing instructions on how to change the scripts to deploy fabric with composer with one organization and multiple peers.
    
