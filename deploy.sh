#!/bin/bash

pnpm i
pnpm build

cd ./apps/server
pm2 restart ecosystem.config.js

cd ../..

yes | cp -rf ./apps/client/dist/* /coding/www/static/chat

echo "Done."

