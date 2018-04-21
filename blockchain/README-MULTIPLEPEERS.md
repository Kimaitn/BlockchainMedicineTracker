## HYPERLEDGER FABRIC W/ COMPOSER - MULTIPEER DEPLOYMENT 
## HYPE HYPE HYPE 
## HYPE AF

## Prerequisites
This tutorial assumes that you have all pre-reqs installed for the previous `mat-network.bna` tutorial. 
Additionally, pre-reqs for fabric must have been installed as well from the `curl -sSL https://goo.gl/6wtTN5 | bash -s 1.1.0` command on all of the machine instances.
Ensure that you have set the path to the platform-specific binaries using a command _like_ `export PATH=$HOME/fabric-samples/bin:$PATH`.
When this project was last deployed, it utilized the following:
* Two t2.medium ec2 Linux instances
* Fabric v 1.1
* Composer v 0.19

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

## Clearing Previous Fabric Instances
If there already is an instance of fabric running, run the following commands to remove them.
* `./teardownFabric.sh`
* `rm -rf composer/crypto-config`
The `./teardownFabric.sh` command has been modified to remove all docker containers, so be careful when executing this command.

## Fast Deployment Steps (Read the README.md for clarification)
Machine one - `ssh -i "avi.pem" ubuntu@ec2-18-188-189-121.us-east-2.compute.amazonaws.com`
Machine two - `ssh -i "avi.pem" ubuntu@ec2-18-217-37-105.us-east-2.compute.amazonaws.com`
Make sure your `cryptogen` path is set. 

1. ssh into both ec2 instances 

2. Make sure your bna is using the permissions file from Avi's branch - "permissionsUpdate"
Compile your bna file and put it into the blockchain folder (this is just for ease).

3. Delete the `crypto-config` folder inside the `composer` folder (if it exists).

4. We are going to scp the blockchain folder in BlockchainMedicineTracker that you have over to machine one. 

`scp -i avi.pem -r ./blockchain ubuntu@ec2-18-188-189-121.us-east-2.compute.amazonaws.com:/home/ubuntu`



5. Inside the `blockchain` folder run `./deploy.sh 18.217.37.105` this will create `crypto-config` 

On your terminal for your local machine run- 
`scp -i avi.pem -r ubuntu@ec2-18-188-189-121.us-east-2.compute.amazonaws.com:/home/ubuntu/blockchain $HOME/Downloads`

6. then 
`scp -i avi.pem -r $HOME/Downloads/blockchain ubuntu@ec2-18-188-189-121.us-east-2.compute.amazonaws.com:/home/ubuntu`

This will copy over the folder from machine 1 to machine 2

So now both machines will have the same `blockchain` folder

(Theoretically the order of steps 8 and 9 can be swapped, however, I ran the steps in this order

7. MACHINE ONE - `./startFabric.sh`

8. MACHINE TWO - `./startFabric-peer2.sh`

9. MACHINE ONE - `./createPeerAdmin.sh`

This will make the `PeerAdmin@hlfv1` this is the peer admin for the fabric network. This admin is responsible for installing chaincode (what our .bna file compiles into) onto our fabric network. We can now install the `mat-network.bna` onto the fabric network

10. MACHINE ONE - `composer network install --card PeerAdmin@hlfv1 --archiveFile mat-network.bna`

11. MACHINE ONE - `composer network start -n mat-network -V 0.0.1 -A admin -S adminpw --card PeerAdmin@hlfv1 -f networkadmin.card`
The mat-network is now running. We now need cards to interact wiht it.  

12. MACHINE ONE - `composer identity request -c PeerAdmin@hlfv1 -u admin -s adminpw -d alice`

13. MACHINE ONE - `composer card create -p ./DevServer_connection.json -u alice -n mat-network -c alice/admin-pub.pem -k alice/admin-priv.pem`
We have now made alice she is a business network admin in our mat-network.

14. MACHINE ONE - `composer card import -f alice@mat-network.card`

Now we are going to have `alice` make our new participant so he can join in on the `BLOCKCHAIN FUN`

(A business should be created before creating this employee but it let me do it so........)
15. MAHCINE ONE - `composer participant add -c alice@trade-network -d '{"$class": "org.mat.Employee", "employeeId": "1", "firstName": "Ex pariatur commodo.", "lastName": "Sunt occaecat qui.","email": "Nisi sit culpa in.", "employeeType": "Admin", "worksFor": "Consequat esse dolore laborum." }'`

16. MACHINE ONE - `composer identity issue -c alice@mat-network -f jo.card -u jdoe -a "resource:org.mat.Employee#1"`

17. MACHINE ONE - `composer card import -f jo.card`

18. MACHINE ONE - `composer card export -c jdoe@mat-network`

19. HOST MACHINE - `scp -i avi.pem -r ubuntu@ec2-18-188-189-121.us-east-2.compute.amazonaws.com:/home/ubuntu/blockchain/jdoe@mat-network.card $HOME/Downloads`

20. HOST MACHINE - `scp -i avi.pem -r $HOME/Downloads/jdoe@mat-network.card ubuntu@ec2-18-217-37-105.us-east-2.compute.amazonaws.com:/home/ubuntu/blockchain`

21. MACHINE TWO - `composer card import -c jdoe@mat-network`

(Step 22 and 23 are just so show the current state of the blockchain)
22. MACHINE ONE - `composer network list -c alice@mat-network`
23. MACHINE TWO - `composer network list -c jdoe@mat-network`

(We could do the transaction on machine two but.... idk if the permissions are going to work for testing purposes I went with machine one and the simplest of transactions to ensure that it goes through)
24. MACHINE ONE - `composer transaction submit --card jdoe@mat-network -d '{"$class": "org.hyperledger.composer.system.AddAsset","registryType": "Asset","registryId": "org.mat.ItemType", "targetRegistry" : "resource:org.hyperledger.composer.system.AssetRegistry#org.mat.ItemType", "resources": [{"$class": "org.mat.ItemType","itemTypeName": "0768"}]}'`

25. REPEAT STEPS 22 and 23

Both the states will be updated with the item type

## Steps moving forward
* Change scripts such that we have multiple orderer nodes and multiple organizations 
* Setting up the angular project 
* ???
* Profit

## Credits
Thanks to https://discourse.skcript.com/t/setting-up-a-blockchain-business-network-with-hyperledger-fabric-composer-running-in-multiple-physical-machine/602 for providing instructions on how to change the scripts to deploy fabric with composer with one organization and multiple peers.