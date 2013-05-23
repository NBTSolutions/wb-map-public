#!/bin/bash

source scripts/init.sh

ROOT=`pwd`
DEPLOY_DIR="."
APPNAME="map"

## detect environment: cloudbees, heroku, or node alrady installed.
## http://wiki.cloudbees.com/bin/view/DEV/Node+Builds
export clean=yes
export skipclean=no
a=$(mkdir /scratch 2>&1)
if [[ $ROOT =~ "/app" ]]; then
    echo "Heroku detected."
    curl -o node.tar.gz https://s3.amazonaws.com/nbt-tools/node-v0.10.4-linux-x64.tar.gz
    tar zxvf node.tar.gz
    export PATH=$PATH:/app/node-v0.10.4-linux-x64/bin
else
    if [[ $a =~ 'exists' ]]; then
        echo "Cloudbees detected."
        curl -s -o use-node https://repository-cloudbees.forge.cloudbees.com/distributions/ci-addons/node/use-node
        NODE_VERSION=0.9.3 \
        source ./use-node

        curl https://npmjs.org/install.sh | sh
        npm install less
    else 
        echo "Normal environment detected."
    fi
fi

# infer deployment directory
if [[ $ROOT =~ "web-app/" ]]; then
    echo "Detected that this project is a Grails submodule. Deploying to web-app/"
    DEPLOY_DIR="../../../../$APPNAME"
else
    echo "Deploying normally; i.e., into webapp/deploy"
    DEPLOY_DIR="."
fi

cd src/main/webapp
./enyo/tools/deploy.js -o $DEPLOY_DIR

cd $ROOT
