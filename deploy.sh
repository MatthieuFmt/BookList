#!/bin/bash
BOOKLIST_PATH="C:\Users\matt1\Desktop\BookList" 
if [[ $1 = "prod" || $1 = "dev" ]] && [[ $2 = "down" || $2 = "up" ]]; then
  fileEnv="docker-compose.${1}.yml"
  downOrUp=$2
  echo "Running docker-compose -f $BOOKLIST_PATH/$fileEnv $downOrUp"
  
  if [[ $downOrUp == "up" ]]; then
    docker-compose -f "$BOOKLIST_PATH/$fileEnv" $downOrUp --build
  else
    docker-compose -f "$BOOKLIST_PATH/$fileEnv" $downOrUp
  fi
else
  echo "Need to follow format ./deploy.sh prod|dev down|up"
fi
