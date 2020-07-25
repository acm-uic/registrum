

$projects=@("api", "banner", "banner-data", "client")
ForEach ($project in $projects) {
    docker build --target $project.Dockerfile --tag "registrum_$($project):latest" ../project/$project
}

docker image prune -f
