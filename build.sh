#!/usr/bin/env bash

_script="$(readlink -f ${BASH_SOURCE[0]})"

directory="$(dirname $_script)"

if [ -d mongo ]; then
    sudo rm -r mongo
fi

sudo rm -r comics tmp

cd $directory/userimages

ls | grep -v default.jpg | xargs rm -r

cd $directory

mkdir comics tmp

chmod -R 777 tmp comics userimages

docker-compose up -d --build
