docker build -t registrum_base -f Base.Dockerfile .
$projects=@("api", "banner", "banner-data", "client")
foreach($project in $projects) {
    docker build --target $project .
}