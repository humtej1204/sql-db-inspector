FROM 	node:22.0.0
WORKDIR /app
COPY 	package*.json ./
RUN 	npm install
RUN     mkdir -p temp
COPY 	. .
EXPOSE 	3000
CMD 	[ "npm", "start" ]
