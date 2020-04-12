FROM debian:buster

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y postfix mailutils

ADD main.cf /etc/postfix/main.cf

ENTRYPOINT [ "postfix", "start-fg" ]
