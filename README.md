# APISIX Dashboard

APISIX Dashboard is designed to make it as easy as possible for users to operate Apache APISIX through a frontend interface.

## What's Apache APISIX Dashboard

The Dashboard is the control plane and performs all parameter checks; Apache APISIX mixes data and control planes and will evolve to a pure data plane.

## Project structure

```text
.
├── Dockerfile
├── README.md
├── api
└── web
```

1. The `api` directory is used to store the `Manager API` source codes, which is used to manage `etcd` and provide APIs to the frontend interface.
2. The `web` directory is used to store the frontend source codes.

## Build and Deployment

This project uses Github Actions to automatically build and push the Docker image to GHCR upon commit to the master branch.

You can run the latest image directly via:

```bash
docker run -d -p 9000:9000 ghcr.io/yorkane/apisix-admin:latest
```

## Demo

```text
Username: admin
Password: admin
```
