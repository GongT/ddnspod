#!/usr/bin/env bash

docker build -f Dockerfile --build-arg=IN_CHINA=${IN_CHINA} . --tag gongt/ddnspod
