#!/bin/bash

colorOff='\033[0m'
boldRed='\033[1;31m'
boldGreen='\033[1;32m'

echoSuccess() {
        echo -e "${boldGreen}$1${colorOff}"
}

# echoFailure() {
#         echo -e "${boldRed}$1${colorOff}"
# }

set -e

# exec > >(tee "/home/weijrn/Documents/weijrn/server/server.log") 2>&1

source /home/weijrn/.nvm/nvm.sh

cd /home/weijrn/Documents/weijrn/server

variableFile="/tmp/weijrn.dat"

if [ -f "$variableFile" ]; then
	url=`curl http://127.0.0.1:4040/api/tunnels -s | jq -r '.tunnels[0].public_url'`
        echo "NGROK URL: "$url

        exit 0
fi

npm install pm2@latest -s -g && pm2 update -s
echoSuccess "PM2 Update Successful"

pm2 kill -s

git pull origin main -q
echoSuccess "Git Pull Successful"

npm install -s
echoSuccess "NPM Install Successful"

pm2 start -s --name "WeijrnServer" "./index.js"
echoSuccess "PM2 Start Successful"

pm2 start -s --name "WeijrnNgrok" "ngrok http 8393"
echoSuccess "NGROK Start Successful"

sleep 1

pm2 save -s --force

url=`curl http://127.0.0.1:4040/api/tunnels -s | jq -r '.tunnels[0].public_url'`

echo "NGROK URL: "$url

echo "$url" > "$variableFile"
