FROM    mhart/alpine-node

RUN     npm install -g http-server

WORKDIR /site
ADD     ./    /site

CMD ["http-server", "--cors", "-p8080", "/site"]
