FROM node:8-alpine
WORKDIR /src

COPY package.json .
ADD server ./admission_cards
ADD server ./server
ADD public ./public
RUN npm install --production

ENV MYSQL_USERNAME msc.scorelab.org
ENV MYSQL_USERNAME root
ENV MYSQL_PASSWORD root
ENV MYSQL_DB postgrad
ENV MYSQL_HOST localhost
ENV EXPRESS_SERVER_PORT 4000
ENV SECRET_KEY 6LfpvzIUAAAAAM4YiSbQwpSJD8Yz_zN2dhRUPjUX
ENV ENCRYPT_KEY SomethingRandomThatNoOneKnowsOf:)
ENV OPENING_DATE 01/01/2017
ENV CLOSING_DATE 01/10/2017
ENV PGW_PROTOCOL http
ENV PGW_HOST 10.2.2.150 
ENV PGW_PORT 8080

EXPOSE 3000

CMD ["npm", "start"]
