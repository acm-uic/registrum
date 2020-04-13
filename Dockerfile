FROM node:buster

WORKDIR /usr/src/app

ADD init.sh /

CMD ["/init.sh"]