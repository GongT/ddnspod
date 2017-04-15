#!/bin/sh

set -e
set -x

NPM="npm --cache=/tmp/npm"

if [ "${IN_CHINA}" = "yes" ]; then
	NPM="${NPM} --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist"
fi

npm install --only=dev

./node_modules/.bin/tsc -p src

rm -rf node_modules

npm install --only=prod

rm -rf /tmp/npm
