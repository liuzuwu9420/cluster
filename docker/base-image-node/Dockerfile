FROM registry.xtc.home/node:10

WORKDIR /xtc/clustermom-front

ADD ./package.json /xtc/clustermom-front

# RUN npm install --unsafe-perm node-gyp node-sass --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist --sass-binary-site=http://npm.taobao.org/mirrors/node-sass \
#     && npm install -g webpack vue-cli --registry=http://nexus.xtc.home/repository/npm \
#     && npm install --registry=http://nexus.xtc.home/repository/npm --disturl=https://npm.taobao.org/dist --sass-binary-site=http://npm.taobao.org/mirrors/node-sass

RUN npm install --registry=http://nexus.xtc.home/repository/npm --disturl=https://npm.taobao.org/dist --sass-binary-site=http://npm.taobao.org/mirrors/node-sass

