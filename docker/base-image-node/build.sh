#! /bin/bash

cp ../../package.json package.json

docker build -t registry.xtc.home/xtc/node-clustermom-front:10 .

rm package.json



