#!/bin/bash

if [ $# -lt 1 ]; then
  echo 1>&2 "$0: please specify Peer 2's IP"
  exit 2
elif [ $# -gt 1 ]; then
  echo 1>&2 "$0: too many arguments"
  exit 2
fi

./composer/begin.sh
CACERT1=`find ./composer/crypto-config/peerOrganizations/org1.mat.com/ca/ -name '*_sk' | cut -d'/' -f7`
CACERT2=`find ./composer/crypto-config/peerOrganizations/org2.mat.com/ca/ -name '*_sk' | cut -d'/' -f7`
CACERT3=`find ./composer/crypto-config/peerOrganizations/org3.mat.com/ca/ -name '*_sk' | cut -d'/' -f7`



sed -i -e "s|<CA1-CERT>|$CACERT1|" ./composer/docker-compose-org1.yml
sed -i -e "s|<CA2-CERT>|$CACERT2|" ./composer/docker-compose-org2.yml
sed -i -e "s|<CA3-CERT>|$CACERT3|" ./composer/docker-compose-org3.yml

