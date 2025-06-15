FROM mcr.microsoft.com/devcontainers/javascript-node:20

RUN apt-get update && apt-get install -y curl git

RUN apt-get install -y python3 python3-pip && pip install chromadb

RUN pip install chromadb[server]
