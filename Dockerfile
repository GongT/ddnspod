FROM node:alpine

CMD dist/entry/server-env.ts
WORKDIR /data
ARG IN_CHINA=no
ENV IN_CHINA="${IN_CHINA}"
VOLUME /mnt

# https://support.dnspod.cn/Kb/showarticle/tsid/83/
ENV NS=f1g1ns1.dnspod.net/f1g1ns2.dnspod.net
# https://support.dnspod.cn/Kb/showarticle/tsid/227/
ENV LOGIN_TOKEN=""
# https://www.dnspod.cn/console/user/security#
ENV DYNAMIC_TOKEN=""

# how to get ip address
ENV IP_DETECT='regexp+http://1212.ip138.com/ic.asp#/您的IP是：\[(\d+.\d+.\d+.\d+)\]/'
# ENV IP_DETECT='json+http://192.168.1.1/wanInfoGet.json#wanInfo.wanPppConn.$[ServiceMode=2].ExternalIPAddress'
# ENV IP_DETECT='file:///mnt/ip-from-outside-line-by-line.txt'
# ENV IP_DETECT='callback:///mnt/ip-detect.js'

ENV IP_DETECT_AUTH=""

ENV IP_CHANGE="interval:?minutes=5"

COPY . /data
RUN pwd && sh build.sh

ENTRYPOINT /usr/local/bin/node
