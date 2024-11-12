#bin/bash

docker -v

runFrontend () {

    echo "Starting frontend"

    cd ./Website/website
    
    npm install

    npm run dev
}

runBackend () {

    echo "Starting backend"

    cd ./Server/Main

    npm install

    npm run dev
}

if ([ $? -ne 0 ]); then
    echo "Docker is not installed"
    exit 1
else
    echo "Compose starting"
    docker-compose up -d --build

    if ([ $? -ne 0 ]); then
        echo "Compose failed"
        exit 1
    else
        echo "Compose started successfully"
        
        echo "Running project ..."

        runFrontend &
        runBackend

        wait

        exit 0
    fi
fi