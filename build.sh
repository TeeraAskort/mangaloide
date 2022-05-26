#!/usr/bin/env bash

_script="$(readlink -f ${BASH_SOURCE[0]})"

directory="$(dirname $_script)"

if [ "$1" == "prod" ]; then
    cd $directory

    docker container stop mangaloidedb mangaloideapp

    docker container rm mangaloideapp mangaloidedb

    if [ "$2" == "ssl" ]; then
        docker container stop nginx-ssl-proxy
        docker container rm nginx-ssl-proxy
    fi

    if [ -d mongo ]; then
        sudo rm -r mongo
    fi

    sudo rm -r comics tmp .env

    cd $directory/userimages

    ls | grep -v default.jpg | sudo xargs rm -r

    cd $directory

    mkdir comics tmp

    chmod -R 777 tmp comics userimages

    cd $directory/docker/prod

    cp .env $directory

    if [ "$2" == "ssl" ]; then
        docker-compose -f docker-compose-ssl.yaml up -d --build
    else
        docker-compose -f docker-compose.yaml up -d --build
    fi

    docker image prune -f

    docker container prune -f

elif [ "$1" == "dev" ]; then
    cd $directory

    docker container stop mangaloidedb mangaloideapp

    docker container rm mangaloideapp mangaloidedb

    if [ -d mongo ]; then
        sudo rm -r mongo
    fi

    sudo rm -r comics tmp .env

    cd $directory/userimages

    ls | grep -v default.jpg | sudo xargs rm -r

    cd $directory

    mkdir comics tmp

    chmod -R 777 tmp comics userimages

    cd $directory/docker/dev

    cp .env $directory

    docker-compose up -d

    docker image prune -f

    docker container prune -f

    cd $directory

    yarn dev
else
    echo "build.sh [option]"
    echo "prod - Build application for production"
    echo "dev - Build application for development"
fi
