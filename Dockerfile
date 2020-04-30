# FROM registry.xtc.home/node:
FROM registry.xtc.home/xtc/node-clustermom-front:10

WORKDIR /xtc/clustermom-front

ADD . /xtc/clustermom-front

RUN npm install --no-optional --registry=http://nexus.xtc.home/repository/npm && npm run build:prod
