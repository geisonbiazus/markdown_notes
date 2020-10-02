## Description

Updates one ky inside of a YAML file

```
cat ./docker-compose.yml | ./update_yaml services backend image geisonbiazus/markdown_notes_backend:1231 > ./docker-compose.yml
```

## Build

```
env GOOS=linux GOARCH=amd64 go build .
```
