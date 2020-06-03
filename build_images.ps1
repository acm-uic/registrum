docker build --build-arg CLIENT_WEBPUSHPUBLIC=testtesttest -t registrum_base -f Base.Dockerfile .
$projects=@("api", "banner", "banner-data", "client")
ForEach ($project in $projects) {
    docker build --target $project --tag "registrum_$($project):latest" .
}

docker image prune -f