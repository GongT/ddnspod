#!/bin/sh

set -e
set -x

NPM="npm --cache=/tmp/npm"

if [ "${IN_CHINA}" = "yes" ]; then
	NPM="${NPM} --registry=${NPM_REGISTRY-http://registry.npm.taobao.org}"
else
	if [ -z "${NPM_REGISTRY}" ]; then
		NPM="${NPM} --registry=https://registry.npmjs.org --disturl=https://npm.taobao.org/dist"
	else
		NPM="${NPM} --registry=${NPM_REGISTRY}"
	fi
fi

npm install --only=dev
echo "install complete"

./node_modules/.bin/tsc -p src

rm -rf node_modules

npm install --only=prod

rm -rf /tmp/npm* ~/.npm
