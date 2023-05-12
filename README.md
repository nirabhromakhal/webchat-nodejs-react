# Simple Web Chat

This project demonstrates a simple web messaging app using NodeJS backend and React.js frontend.\
Head to https://wchat-nirabhro.web.app/ to try it out.

## Frontend

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.\
The frontend has been deployed on Firebase Hosting at https://wchat-nirabhro.web.app/.

## Backend

### `node server/start.js`

Runs the backend locally.\
The backend for production has been deployed on railway which offers free nodejs hosting.\
The backend is deployed at https://webchat-nodejs-react-production.up.railway.app/. \
I was not able to use Google Cloud for free nodejs hosting.

## Postgres

Using Supabase for free postgreSQL hosting.\
Postgres is used for storing the messages.

## Realtime Communication

Using Supabase Realtime for broadcasting and listening to messages between client.\
This is to notify online clients when they receive a message from another client.



