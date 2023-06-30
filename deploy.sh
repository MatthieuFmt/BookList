#!/bin/bash
BOOKLIST_PATH=$(pwd)
if [[ $1 = "down" || $1 = "up" ]]; then
  fileEnv="docker-compose.yml"
  downOrUp=$1
  echo "Running docker-compose -f $BOOKLIST_PATH/$fileEnv $downOrUp"
  
  if [[ $downOrUp == "up" ]]; then
    docker-compose -f "$BOOKLIST_PATH/$fileEnv" $downOrUp --build
  else
    docker-compose -f "$BOOKLIST_PATH/$fileEnv" $downOrUp
  fi
else
  echo "Need to follow format ./deploy.sh down|up"
fi
