#!/bin/bash
./composer/begin.sh
CACERT=`find ./composer/crypto-config/peerOrganizations/org1.mat.com/ca/ -name '*_sk' | cut -d'/' -f7`
KEYSTORE=`find ./composer/crypto-config/peerOrganizations/org1.mat.com/users/Admin@org1.mat.com/msp/keystore/ -name '*_sk' | cut -d'/' -f10`

sed -i -e "s|<CA-CERT>|$CACERT|" ./composer/docker-compose-peer0.yml
sed -i -e "s|<KEYSTORE>|$KEYSTORE|" ./createPeerAdminCard.sh
