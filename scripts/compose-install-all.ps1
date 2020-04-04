$services = "api","banner","client"
docker-compose up -d

ForEach($service in $services) {
    docker-compose exec $service npm install
    docker-compose restart $service
}
