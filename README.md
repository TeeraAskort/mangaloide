# Mangaloide

## Description

This is an online comic host, it lets users create comics, upload chapters on ".zip" format and watch the newly upload chapters.
It uses the Next.js framework and MongoDB for storing data.

Chapters uploaded to the server will be decompressed and then, the images will be converted to ".jpg".

## How to run the application

- `yarn install`
- `docker-compose up -d`
- `mkdir comics tmp`
- `chmod 777 -R comics tmp`
- `cp .env.template .env`
- `yarn dev`

