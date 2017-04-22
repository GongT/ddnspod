#!/usr/bin/env bash
set -x

# IP_DETECT='json+http://192.168.1.1/wanInfoGet.json#wanInfo.wanPppConn.$[ServiceMode=2].ExternalIPAddress'
# IP_DETECT_AUTH="http://192.168.1.1/login.cgi?username=user&psd=h68gqfs9"
# IP_CHANGE="interval:?seconds=5"

if [ -z "${LOGIN_TOKEN}" ]; then
	read -p "LOGIN_TOKEN: " LOGIN_TOKEN
fi

docker rm -f ddnspod

mkdir -p mnt
docker run --name ddnspod -d \
	-v "$(pwd)/mnt:/mnt" \
	-e "IP_DETECT=${IP_DETECT-""}" \
	-e "IP_DETECT_AUTH=${IP_DETECT_AUTH-""}" \
	-e "IP_CHANGE=${IP_CHANGE-""}" \
	-e "LOGIN_TOKEN=${LOGIN_TOKEN-""}" \
	gongt/ddnspod \
	example.com
