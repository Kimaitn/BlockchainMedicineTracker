#!/bin/bash

if [ $# -lt 1 ]; then
  echo 1>&2 "$0: please specify Peer 2's IP"
  exit 2
elif [ $# -gt 1 ]; then
  echo 1>&2 "$0: too many arguments"
  exit 2
fi

./composer/begin.sh
CACERT=`find ./composer/crypto-config/peerOrganizations/org1.example.com/ca/ -name '*._sk' | cut -d'/' -f2`
KEYSTORE=`find ./composer/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/ -name '*._sk' | cut -d'/' -f2`

sed -i -e "s|<CA-CERT>|$CACERT|" ./composer/docker-compose.yml
sed -i -e "s|<Peer-1-IP>|`hostname -i`|" ./composer/docker-compose.yml

sed -i -e "s|<KEYSTORE>|$KEYSTORE|" ./createPeerAdminCard.sh
sed -i -e "s|<Peer-2-IP>|$1|" ./createPeerAdminCard.sh