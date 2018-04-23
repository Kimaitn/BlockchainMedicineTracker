#!/bin/bash

if [ $# -lt 2 ]; then
  echo 1>&2 "$0: please specify Peer 1's followed by Peer 2's IP"
  exit 2
elif [ $# -gt 2 ]; then
  echo 1>&2 "$0: too many arguments"
  exit 2
fi

./composer/begin.sh
CACERT=`find ./composer/crypto-config/peerOrganizations/org1.example.com/ca/ -name '*_sk' | cut -d'/' -f7`
KEYSTORE=`find ./composer/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/ -name '*_sk' | cut -d'/' -f10`

sed -i -e "s|<CA-CERT>|$CACERT|" ./composer/docker-compose.yml
sed -i -e "s|<PEER-1-IP>|$1|g" ./composer/docker-compose.yml
sed -i -e "s|<PEER-1-IP>|$1|g" ./composer/docker-compose-peer2.yml

sed -i -e "s|<KEYSTORE>|$KEYSTORE|" ./createPeerAdminCard.sh
sed -i -e "s|<PEER-2-IP>|$2|g" ./createPeerAdminCard.sh
sed -i -e "s|<PEER-1-IP>|$1|g" ./createPeerAdminCard.sh
