FROM node:alpine

CMD dist/server.js
WORKDIR /data
ARG IN_CHINA=no

# https://support.dnspod.cn/Kb/showarticle/tsid/83/
ENV NS=f1g1ns1.dnspod.net/f1g1ns2.dnspod.net
# https://support.dnspod.cn/Kb/showarticle/tsid/227/
ENV LOGIN_TOKEN=""
# https://www.dnspod.cn/console/user/security#
ENV DYNAMIC_TOKEN=""

COPY . /data
RUN pwd && sh build.sh

ENTRYPOINT /usr/local/bin/node
